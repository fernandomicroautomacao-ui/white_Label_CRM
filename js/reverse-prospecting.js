// Product-first workspace using the CRM's existing discovery and persistence adapters.
(function () {
    'use strict';
    const M=window.ReverseProspectingModel;
    const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    let owner=null, draft=null, active=null, job=null, initialized=false;
    const val=id=>document.getElementById(id)?.value || '';
    const user=()=>typeof usuarioAtual!=='undefined' && usuarioAtual ? String(usuarioAtual.id) : '';
    function ensureSession() {
        const id=user();if(id===owner)return;
        if(job)job.cancelled=true;
        job=null;owner=id;draft=null;active=null;
        const fieldset=document.getElementById('reversePlanFields');if(fieldset)fieldset.disabled=false;
        const cancel=document.getElementById('reverseCancelSearch');if(cancel)cancel.hidden=true;
        if(id)try{const saved=JSON.parse(localStorage.getItem('crm_reverse_prospecting_v1:'+id)||'null');if(saved?.draft)draft=M.clean(saved.draft);}catch(e){console.warn('Plano de prospecção indisponível',e);}
        initialized=false;
    }
    function persist() {
        if(!owner)return;
        try{localStorage.setItem('crm_reverse_prospecting_v1:'+owner,JSON.stringify({draft}));}
        catch(e){showToast('Não foi possível salvar o plano neste navegador.','warning');}
    }
    function profiles() {
        let catalog=window.CategoriasProdutos?.dados;
        if(!catalog?.produtos?.length)try{catalog=JSON.parse(localStorage.getItem('crm_catalogo_hierarquico')||'{}');}catch(e){catalog={};}
        return [...M.presets.map(p=>({...p,id:'preset:'+p.id,source:'Roteiro sugerido; validar critérios'})),...M.catalogProfiles(catalog),{id:'custom',name:'Produto personalizado',targets:[],keywords:[],excluded:[],source:'Critérios definidos pelo vendedor'}];
    }
    function setStatus(message) { const el=document.getElementById('reverseSearchStatus');if(el)el.textContent=message; }
    function readForm() {
        return M.clean({id:val('reverseProduct'),name:val('reverseName'),targets:val('reverseTargets'),keywords:val('reverseKeywords'),cnaes:val('reverseCnaes'),excluded:val('reverseExcluded'),application:val('reverseApplication'),question:val('reverseQuestion'),city:val('reverseCity'),uf:val('reverseUF'),ddds:val('reverseDDDs'),minScore:val('reverseMinScore')});
    }
    function fill(profile) {
        const values={reverseProduct:profile.id,reverseName:profile.name,reverseTargets:(profile.targets||[]).join('\n'),reverseKeywords:(profile.keywords||[]).join('\n'),reverseCnaes:(profile.cnaes||[]).join('; '),reverseExcluded:(profile.excluded||[]).join('\n'),reverseApplication:profile.application,reverseQuestion:profile.question,reverseCity:profile.city,reverseUF:profile.uf,reverseDDDs:(profile.ddds||[]).join('; '),reverseMinScore:profile.minScore??0};
        Object.entries(values).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.value=value??'';});preview();
    }
    function render() {
        ensureSession();
        const selector=document.getElementById('reverseProduct');if(!selector || initialized)return;
        const list=profiles();
        if(draft && !list.some(p=>p.id===draft.id))list.push({...draft,source:'Plano salvo'});
        selector.innerHTML='<option value="">Selecione um produto ou roteiro</option>'+list.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}${p.id.startsWith('catalog:')?' · Catálogo':''}</option>`).join('');
        if(draft)fill(draft);else fill({id:'',name:'',targets:[],keywords:[],minScore:0});
        initialized=true;
        banner();
    }
    function preview() {
        const p=readForm(),queries=M.queries(p);
        const el=document.getElementById('reverseQueryPreview');if(!el)return;
        el.innerHTML=queries.length?'<strong>Consultas previstas · até 6 por execução</strong><ul>'+queries.map(q=>`<li>${esc(q)}</li>`).join('')+'</ul>':'Defina os tipos de empresa que deseja encontrar.';
    }
    function choose() {
        const selected=profiles().find(p=>p.id===val('reverseProduct'));
        if(!selected)return;
        const location=readForm();
        fill({...selected,city:location.city,uf:location.uf,ddds:location.ddds,minScore:location.minScore});
        const el=document.getElementById('reverseProductSource');if(el)el.textContent=selected.source || '';
    }
    function apply() {
        ensureSession();if(!owner)return false;
        const p=readForm();
        if(!p.id || !p.name)return showToast('Selecione e informe o produto.','warning'),false;
        if(!p.keywords.length && !p.cnaes.length && !p.targets.length)return showToast('Informe aplicações, CNAEs ou tipos de empresa.','warning'),false;
        if(val('reverseDDDs').trim() && !p.ddds.length)return showToast('Informe DDDs com dois dígitos, separados por ponto e vírgula.','warning'),false;
        if(p.uf && !['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].includes(p.uf))return showToast('Informe uma UF brasileira válida.','warning'),false;
        // Different custom products must not share their assessment history.
        if(p.id==='custom')p.id='custom:'+M.normalize(p.name).replace(/ /g,'-');
        draft=p;active=JSON.parse(JSON.stringify(p));persist();
        if(val('reverseProduct')==='custom'){
            const option=document.createElement('option');option.value=p.id;option.textContent=p.name+' · Personalizado';document.getElementById('reverseProduct').append(option);document.getElementById('reverseProduct').value=p.id;
        }
        limparFiltrosTerritory();banner();abrirModoProspeccao('empresas');return true;
    }
    function banner() {
        const el=document.getElementById('reverseActivePlan');if(!el)return;
        el.innerHTML=active?`<strong>Produto-alvo: ${esc(active.name)}</strong><span>${esc([active.city,active.uf,active.ddds.length?'DDD '+active.ddds.join(', '):''].filter(Boolean).join(' · ')||'Todo território cadastrado')} · aderência mínima ${active.minScore}/100</span><button class="btn btn-outline btn-sm" data-reverse-action="edit">Editar critérios</button><button class="btn btn-outline btn-sm" data-reverse-action="clear">Ver todas as empresas</button>`:'Selecione um produto em “Produto e aplicação” para iniciar a prospecção reversa.';
    }
    function getActive() {ensureSession();return active;}
    function matches(lead) {const p=getActive();if(!p)return true;const fit=M.evaluate(lead,p);return M.inTerritory(lead,p) && fit.score>=p.minScore;}
    function score(lead) {const p=getActive();return p?M.evaluate(lead,p).score:null;}
    function summary(all, visible) {
        const p=getActive(),el=document.getElementById('reverseResultsSummary');if(!el)return;
        if(!p){el.textContent='Exibindo empresas sem recorte de produto.';return;}
        const territory=all.filter(l=>M.inTerritory(l,p));
        const confirmed=visible.filter(l=>M.evaluate(l,p).saved?.status==='confirmed').length;
        el.textContent=`${visible.length} empresa(s) neste recorte · ${confirmed} com aplicação confirmada · ${all.length-territory.length} fora do território ou sem localização/DDD suficientes. Aderência é uma regra de triagem, não probabilidade de compra.`;
    }
    function touch(lead) {
        if(!lead._discovery){const original=leads.find(l=>String(l.id)===String(lead.id));if(original){original._modificadoLocal=true;original.atualizadoEm=new Date().toISOString();}}
        salvarDadosDebounced(50);
    }
    function find(id) {return window.obterEmpresasTerritory?.().find(l=>String(l.id)===String(id));}
    function evidenceHTML(lead) {
        const p=getActive();if(!p)return '';
        const result=M.evaluate(lead,p),saved=result.saved||{};
        const source=lead._discovery?.row?.prospecting?.reverseOrigin;
        const reasons=[...result.matches.map(m=>`${m.field}: “${m.term}”`),...result.cnaes.map(c=>'CNAE compatível: '+c),...result.negatives.map(n=>'Termo de exclusão: '+n)];
        const date=saved.updatedAt?new Date(saved.updatedAt).toLocaleDateString('pt-BR'):'';
        const website=lead.website || lead._discovery?.row?.website;
        let websiteUrl='';try{const u=new URL(/^https?:\/\//i.test(website)?website:'https://'+website);if(website && ['http:','https:'].includes(u.protocol))websiteUrl=u.href;}catch(e){}
        return `<section class="reverse-evidence"><h3>${esc(p.name)}</h3>
            <div class="reverse-fit"><strong>${result.score}/100</strong><span>${esc(result.status)}</span><small>Cadastro preenchido: ${result.quality}%</small></div>
            ${reasons.length?'<ul>'+reasons.map(r=>`<li>${esc(r)}</li>`).join('')+'</ul>':'<p>Nenhum indício suficiente nos dados cadastrados. Pesquise e valide a aplicação.</p>'}
            <p><strong>Aplicação a investigar:</strong> ${esc(p.application || 'Defina a aplicação no plano.')}</p>
            <p><strong>Pergunta sugerida:</strong> ${esc(p.question || 'Qual processo produtivo pode utilizar este produto?')}</p>
            ${source?`<small>Origem: busca por ${esc(source.productName)} em ${esc(source.city)}. O resultado da busca não confirma o uso do produto.</small>`:''}
            <div class="territory-actions">${websiteUrl?`<a class="territory-action" href="${esc(websiteUrl)}" target="_blank" rel="noopener noreferrer">Visitar site</a>`:''}<a class="territory-action" href="https://www.google.com/search?q=${encodeURIComponent([lead.empresa,lead.cidade,p.name].filter(Boolean).join(' '))}" target="_blank" rel="noopener noreferrer">Pesquisar aplicação</a></div>
            <label class="prospecting-field">Evidência / resposta do contato<textarea id="reverseEvidence" rows="3" placeholder="Registre o que foi observado ou confirmado.">${esc(saved.note||'')}</textarea></label>
            <label class="prospecting-field">Fonte ou contato<input id="reverseEvidenceSource" value="${esc(saved.source||'')}" placeholder="URL da página ou nome/cargo de quem informou"></label>
            <label class="prospecting-field">Validação para este produto<select id="reverseAssessment"><option value="pending" ${saved.status==='pending' || !saved.status?'selected':''}>A investigar</option><option value="confirmed" ${saved.status==='confirmed'?'selected':''}>Aplicação confirmada</option><option value="rejected" ${saved.status==='rejected'?'selected':''}>Sem aplicação</option></select></label>
            <label class="prospecting-field">Próxima ação<input id="reverseNextAction" value="${esc(saved.nextAction||'')}" placeholder="Ex.: confirmar pressão e ciclo com manutenção"></label>
            <label class="prospecting-field">Data do retorno<input id="reverseNextDate" type="date" value="${esc(saved.nextDate||'')}"></label>
            <button class="btn btn-primary btn-sm" data-reverse-action="save-evidence" data-lead-id="${esc(lead.id)}">Salvar validação do produto</button>
            ${!lead._discovery?`<button class="btn btn-outline btn-sm" data-reverse-action="next-action" data-lead-id="${esc(lead.id)}">Definir próxima ação no CRM</button>`:''}
            ${date?`<small>Validação registrada em ${esc(date)}.</small>`:''}
            <details><summary>Abordagem sugerida</summary><p>${esc(`Olá! Gostaria de entender se ${lead.empresa || 'sua empresa'} possui alguma aplicação para ${p.name}. ${p.question || 'Podemos conversar com a equipe responsável?'}`)}</p></details>
        </section>`;
    }
    function saveEvidence(id, setTask=false) {
        const p=getActive(),lead=find(id);if(!p || !lead)return;
        const status=val('reverseAssessment'),note=val('reverseEvidence').trim(),source=val('reverseEvidenceSource').trim();
        if(!['pending','confirmed','rejected'].includes(status))return;
        if(status!=='pending' && (!note || !source))return showToast('Registre a evidência e a fonte/contato antes de confirmar ou descartar a aplicação.','warning');
        const nextAction=val('reverseNextAction').trim(),nextDate=val('reverseNextDate');
        if(setTask && (!nextAction || !nextDate))return showToast('Informe a próxima ação e a data de retorno.','warning');
        const td=lead.tarefas.territory;
        td.reverse=td.reverse || {};td.reverse.assessments=td.reverse.assessments || {};
        td.reverse.assessments[p.id]={productName:p.name,application:p.application,status,note:note.slice(0,4000),source:source.slice(0,1000),nextAction:nextAction.slice(0,1000),nextDate,updatedAt:new Date().toISOString(),updatedBy:user()};
        if(setTask && !lead._discovery){const original=leads.find(l=>l.id===lead.id);if(original){original.proximaAcao=nextAction;original.proximaData=nextDate;}}
        touch(lead);renderizarTerritoryIntelligence();showToast(setTask?'Próxima ação salva no CRM.':'Validação do produto salva.');
    }
    function cleanResult(raw) {
        if(!raw || typeof raw!=='object')return null;
        const text=(...values)=>String(values.find(v=>typeof v==='string' || typeof v==='number')??'').trim().slice(0,4000);
        const empresa=text(raw.empresa,raw.nome,raw.name);if(!empresa)return null;
        const endereco=text(raw.endereco,raw.address,raw.formatted_address);
        const parsed=coletorExtrairCidadeUF(endereco);
        return {empresa,nome:text(raw.nome),endereco,cidade:text(raw.cidade,parsed.cidade),estado:text(raw.estado,raw.uf,parsed.estado),
            telefone:text(raw.telefone,raw.phone),whatsapp:text(raw.whatsapp),email:text(raw.email),website:text(raw.website,raw.site),
            cnpj:text(raw.cnpj),categoria:text(raw.categoria,raw.category),cnae:text(raw.cnae),observacoes:text(raw.observacoes),
            place_id:text(raw.place_id,raw.placeId),...Prospecting.coords(raw),tratado:false,promovido:false};
    }
    function key(row) {const cnpj=M.digits(row.cnpj);return cnpj.length===14?'cnpj:'+cnpj:row.place_id?'place:'+row.place_id:row.endereco && row.empresa?'address:'+M.normalize(row.empresa)+'|'+M.normalize(row.endereco):null;}
    async function request(query) {
        let timer;
        try{return await Promise.race([supabaseClient.functions.invoke('buscar-leads-maps',{body:{termo:query,buscarEmail:document.getElementById('reverseFetchEmails')?.checked===true}}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Consulta excedeu 45 segundos.')),45000);})]);}
        finally{clearTimeout(timer);}
    }
    async function search() {
        ensureSession();if(job)return;
        if(!apply())return;
        const p=JSON.parse(JSON.stringify(active)),queries=M.queries(p);
        if(!p.city || !p.uf || !queries.length){abrirModoProspeccao('produto');return showToast('Para buscar novas empresas, informe cidade, UF e ao menos um tipo de empresa.','warning');}
        if(typeof supabaseClient==='undefined' || !supabaseClient?.functions?.invoke)return showToast('Conexão de busca indisponível. Você pode analisar as empresas já cadastradas.','error');
        if(typeof filtroAdminUsuarioId!=='undefined' && filtroAdminUsuarioId && String(filtroAdminUsuarioId)!==user())return showToast('Selecione seu próprio usuário para coletar novas empresas.','warning');
        const current={owner:user(),cancelled:false};job=current;
        const fieldset=document.getElementById('reversePlanFields');if(fieldset)fieldset.disabled=true;
        const cancel=document.getElementById('reverseCancelSearch');if(cancel)cancel.hidden=false;
        const seen=new Set();
        coletorListas.filter(l=>!l.reverseOwnerId || String(l.reverseOwnerId)===current.owner).forEach(l=>l.linhas.forEach(r=>{const k=key(r);if(k)seen.add(k);}));
        let list=null,added=0,duplicates=0,errors=0,completed=0;
        const errorMessages=[];
        try{
            for(let i=0;i<queries.length;i++){
                if(current.cancelled || user()!==current.owner)break;
                setStatus(`Consulta ${i+1}/${queries.length}: ${queries[i]}`);
                try{
                    const response=await request(queries[i]);
                    if(current.cancelled || user()!==current.owner)break;
                    if(response.error || response.data?.error)throw new Error(response.error?.message || String(response.data.error));
                    if(!Array.isArray(response.data?.resultados))throw new Error('Resposta de busca sem lista de resultados.');
                    const rows=response.data.resultados.map(cleanResult).filter(Boolean);
                    for(const row of rows){
                        const k=key(row);if(k && seen.has(k)){duplicates++;continue;}if(k)seen.add(k);
                        if(!list){list={id:gerarId(),nome:`Reversa: ${p.name} · ${p.city}`.slice(0,100),linhas:[],reverseOwnerId:current.owner,reversePlan:p};coletorListas.push(list);}
                        const meta=Prospecting.metadata(row);
                        meta.reverseOrigin={productId:p.id,productName:p.name,query:queries[i],city:p.city,uf:p.uf,collectedAt:new Date().toISOString()};
                        meta.territory.reverse={origin:{productId:p.id,productName:p.name,query:queries[i],collectedAt:meta.reverseOrigin.collectedAt},assessments:{}};
                        list.linhas.push(row);added++;
                    }
                    completed++;
                    if(list){coletorListaAtivaId=list.id;coletorSelecionados.clear();coletorPaginaAtual=1;salvarDadosDebounced(50);renderizarTerritoryIntelligence();}
                }catch(e){if(user()!==current.owner)break;errors++;errorMessages.push(`${queries[i]}: ${e.message}`);}
            }
        }finally{
            if(job===current){job=null;if(fieldset)fieldset.disabled=false;if(cancel)cancel.hidden=true;}
            if(user()===current.owner){
                setStatus(`${current.cancelled?'Busca interrompida. ':''}${added} novas empresas · ${duplicates} repetidas ignoradas · ${completed}/${queries.length} consultas concluídas · ${errors} falha(s).${errorMessages.length?' '+errorMessages.join(' | '):''}`);
                if(added){abrirModoProspeccao('mapa');showToast(`${added} empresas coletadas. Revise a aderência antes de promover.`);}else if(!errors && !current.cancelled)showToast('Nenhuma empresa nova retornada. Ajuste os critérios ou consulte as listas existentes.','warning');
            }
        }
    }
    function handleClick(event) {
        const button=event.target.closest?.('[data-reverse-action]');if(!button)return;
        const action=button.dataset.reverseAction;
        if(action==='edit'){abrirModoProspeccao('produto');return;}
        if(action==='clear'){ensureSession();active=null;banner();limparFiltrosTerritory();return;}
        if(action==='apply')apply();
        if(action==='search')search();
        if(action==='cancel' && job){job.cancelled=true;setStatus('Interrompendo após a consulta em andamento. Resultados já coletados foram preservados.');}
        if(action==='save-evidence')saveEvidence(button.dataset.leadId);
        if(action==='next-action')saveEvidence(button.dataset.leadId,true);
    }
    document.addEventListener('click',handleClick);
    document.addEventListener('change',event=>{if(event.target.id==='reverseProduct')choose();});
    document.addEventListener('input',event=>{if(event.target.closest?.('#reversePlanFields'))preview();});
    window.ReverseProspecting={render,getActive,matches,score,summary,evidenceHTML,apply,search,saveEvidence,cleanResult};
})();
