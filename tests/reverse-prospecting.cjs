// node tests/reverse-prospecting.cjs — DOM adapter and mocked search, no external requests.
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function harness() {
 const elements=new Map(),storage=new Map(),events={};
 const el=id=>{if(!elements.has(id))elements.set(id,{id,value:'',innerHTML:'',textContent:'',hidden:false,disabled:false,checked:false,dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return true}},setAttribute(){},append(){}});return elements.get(id);};
 let counter=0;
 const ctx={console,URL,URLSearchParams,setTimeout,clearTimeout,document:{getElementById:el,querySelectorAll:()=>[],querySelector:()=>null,createElement:()=>({}),addEventListener:(name,fn)=>{(events[name]||=[]).push(fn)}},
 localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},usuarioAtual:{id:'u1',papel:'vendedor'},filtroAdminUsuarioId:'',
 leads:[{id:'crm-a',empresa:'Máquinas A',usuarioId:'u1',cidade:'Boituva',estado:'SP',cnpj:'12345678000199',codigoUnico:'old-name',telefone:'15999990000',observacoes:'Fabricação de sopradora e sopro PET',tarefas:{}},
 {id:'crm-b',empresa:'Oficina B',usuarioId:'u1',cidade:'Boituva',estado:'SP',observacoes:'Conserto de bicicletas',tarefas:{}}],
 coletorListas:[{id:'list',nome:'Minha lista',linhas:[]}],coletorListaAtivaId:'list',coletorSelecionados:new Set(),coletorPaginaAtual:1,COLETOR_ITENS_POR_PAGINA:30,
 gerarId:()=> 'generated-'+(++counter),salvarDados(){},salvarDadosDebounced(){},renderizarAll(){},showToast:(message)=>{ctx.lastToast=message},hoje:()=> '2026-09-30',fecharTodosModais(){},svgIcone:()=>'',confirm:()=>true,prompt:()=> 'Fora do perfil',supabaseClient:{functions:{invoke:async()=>({data:{resultados:[]}})}}};
 ctx.window=ctx;ctx.open=url=>{ctx.lastRoute=url};vm.createContext(ctx);
 for(const file of ['coletor','navigation','reverse-prospecting-model','prospecting-intelligence','reverse-prospecting','territory-intelligence'])vm.runInContext(fs.readFileSync(root+'/js/'+file+'.js','utf8'),ctx);
 const setPlan=()=>{ctx.ReverseProspecting.render();const fields={reverseProduct:'preset:pet',reverseName:'Válvula de sopro PET',reverseTargets:'Fabricantes de sopradoras\nFabricantes de garrafas PET',reverseKeywords:'sopradora\nsopro PET',reverseCnaes:'',reverseExcluded:'reciclagem de PET',reverseApplication:'Comando do sopro; validar condições',reverseQuestion:'Fabricam ou usam sopradoras?',reverseCity:'Boituva',reverseUF:'SP',reverseDDDs:'15',reverseMinScore:'30'};for(const[k,v]of Object.entries(fields))el(k).value=v;};
 const click=(action,id)=>{for(const fn of events.click||[])fn({target:{closest:()=>({dataset:{reverseAction:action,leadId:id}})}})};
 return{ctx,el,storage,setPlan,click};
}
(async()=>{
 const {ctx,el,setPlan,click,storage}=harness();
 ctx.navegarPara('prospeccao');assert.equal(el('reverseProductPanel').hidden,false);
 assert.match(el('reverseProduct').innerHTML,/Válvula de sopro PET/);
 setPlan();assert.equal(ctx.ReverseProspecting.apply(),true);
 assert.equal(el('territoryKpiTotal').textContent,1,'only territorial match with product evidence passes');
 assert.equal(ctx.ReverseProspecting.score(ctx.leads[0]),60);
 assert.equal(ctx.ReverseProspecting.score(ctx.leads[1]),0);
 assert.equal(ctx.ReverseProspectingModel.evaluate({...ctx.leads[0],observacoes:'pet shop'},ctx.ReverseProspecting.getActive()).score,0,'PET not matched inside unrelated words');
 assert.equal(ctx.ReverseProspectingModel.ddd('+55 15 99999-0000'),'15');
 assert.equal(ctx.ReverseProspectingModel.ddd('123'),'');
 const c=ctx.ReverseProspectingModel.catalogProfiles({produtos:[{id:'p',nome:'Produto',ativo:true,subsubcategoriaId:'ss',clientesAlvo:['OEM'],palavrasChave:['avanço']},{id:'off',ativo:false}],subsubcategorias:[{id:'ss',subcategoriaId:'s'}],subcategorias:[{id:'s',categoriaId:'c'}],categorias:[{id:'c',cnaesRelacionados:['28.29-1']}]});
 assert.equal(c.length,1);assert.equal(c[0].cnaes[0],'28.29-1');
 ctx.selecionarLeadTerritory('crm-a');assert.match(el('territoryProfile').innerHTML,/Pergunta sugerida/);
 el('reverseAssessment').value='confirmed';el('reverseEvidence').value='';el('reverseEvidenceSource').value='';
 ctx.ReverseProspecting.saveEvidence('crm-a');assert.match(ctx.lastToast,/evidência/);assert.equal(ctx.ReverseProspecting.score(ctx.leads[0]),60);
 el('reverseEvidence').value='Manutenção confirmou duas sopradoras';el('reverseEvidenceSource').value='Carlos, manutenção';
 el('reverseNextAction').value='Confirmar pressão e vazão';el('reverseNextDate').value='2026-10-02';
 ctx.ReverseProspecting.saveEvidence('crm-a',true);
 assert.equal(ctx.ReverseProspecting.score(ctx.leads[0]),100);assert.equal(ctx.leads[0].proximaAcao,'Confirmar pressão e vazão');assert.equal(ctx.leads[0]._modificadoLocal,true);
 const other=ctx.ReverseProspectingModel.clean({...ctx.ReverseProspecting.getActive(),id:'preset:vacuum',keywords:['ventosas'],targets:[]});
 assert.notEqual(ctx.ReverseProspectingModel.evaluate(ctx.leads[0],other).score,100,'validation is product specific');
 const hostile=ctx.ReverseProspecting.evidenceHTML({...ctx.leads[0],empresa:'<img src=x onerror=alert(1)>'});assert(!hostile.includes('<img src=x'));assert(hostile.includes('&lt;img'));
 // CRM promotion has preserved CNPJ even when a legacy code is non-CNPJ.
 assert.equal(ctx.Prospecting.match({cnpj:'12345678000199'},ctx.leads).id,'crm-a');
 // Partial response: retain successful results and display the failing query.
 let calls=0;
 ctx.supabaseClient.functions.invoke=async(name,args)=>{calls++;assert.equal(name,'buscar-leads-maps');assert.match(args.body.termo,/Boituva, SP/);if(calls===2)return {error:{message:'quota exhausted'}};return {data:{resultados:[{empresa:'Fábrica C',endereco:'Rua A, Boituva - SP',telefone:'15988880000',cnpj:'98765432000188',observacoes:'sopradora',location:{latitude:-23.2,longitude:-47.6}},{empresa:'Fábrica C',endereco:'Rua A, Boituva - SP',cnpj:'98765432000188'}]}};};
 setPlan();await ctx.ReverseProspecting.search();
 assert.equal(calls,2);assert.match(el('reverseSearchStatus').textContent,/1 novas empresas/);assert.match(el('reverseSearchStatus').textContent,/1 falha/);
 const list=ctx.coletorListas.find(l=>l.reverseOwnerId==='u1');assert.equal(list.linhas.length,1);
 assert.equal(list.linhas[0].prospecting.territory.lat,-23.2);assert.equal(list.linhas[0].prospecting.reverseOrigin.productId,'preset:pet');
 const discovery=ctx.obterEmpresasTerritory().find(l=>l.empresa==='Fábrica C');
 assert.equal(ctx.ReverseProspecting.score(discovery),30);
 const noEvidence={...discovery,observacoes:'',empresa:'Outra',_discovery:{row:{empresa:'Outra',prospecting:list.linhas[0].prospecting}}};
 assert.equal(ctx.ReverseProspecting.score(noEvidence),0,'search query is never used as evidence');
 el('reverseAssessment').value='confirmed';el('reverseEvidence').value='Aplicação validada';el('reverseEvidenceSource').value='Contato na fábrica';ctx.ReverseProspecting.saveEvidence(discovery.id);
 ctx.promoverProspeccao(discovery.id);
 const promoted=ctx.leads.find(l=>l.empresa==='Fábrica C');assert(promoted);assert.equal(promoted.tarefas.territory.reverse.assessments['preset:pet'].status,'confirmed');assert.equal(promoted.cnpj,'98765432000188');
 ctx.supabaseClient.functions.invoke=async()=>({data:{resultados:[{empresa:'Fábrica C',cnpj:'98765432000188'}]}});setPlan();await ctx.ReverseProspecting.search();assert.equal(list.linhas.length,1,'repeat search deduplicates');
 // Pending search: cancel before return must not append the late response.
 let resolve;
 ctx.supabaseClient.functions.invoke=()=>new Promise(r=>resolve=r);setPlan();const pending=ctx.ReverseProspecting.search();
 click('cancel');resolve({data:{resultados:[{empresa:'Late',endereco:'Boituva - SP'}]}});await pending;
 assert(!ctx.coletorListas.some(l=>l.linhas.some(r=>r.empresa==='Late')));
 // Session changes invalidate delayed results and remove active product/user state.
 setPlan();const pending2=ctx.ReverseProspecting.search();ctx.usuarioAtual={id:'u2',papel:'vendedor'};ctx.ReverseProspecting.render();resolve({data:{resultados:[{empresa:'Wrong owner'}]}});await pending2;
 assert.equal(ctx.ReverseProspecting.getActive(),null);assert.equal(el('reverseName').value,'');assert.equal(el('reversePlanFields').disabled,false);
 assert(!ctx.coletorListas.some(l=>l.linhas.some(r=>r.empresa==='Wrong owner')));
 assert(!ctx.coletorListasPermitidas().includes(list));const count=ctx.leads.length;ctx.coletorPromoverParaCRM({lista:list,linhas:list.linhas});assert.equal(ctx.leads.length,count);
 assert(storage.has('crm_reverse_prospecting_v1:u1'));assert(!storage.has('crm_reverse_prospecting_v1:u2'));
 ctx.usuarioAtual={id:'u1',papel:'vendedor'};ctx.ReverseProspecting.render();assert.equal(el('reverseName').value,'Válvula de sopro PET');
 console.log('PASS: product-first navigation, catalogue, matching/explanations, geography/DDD, evidence validation, per-product state, next action, safe rendering, partial search, deduplication, cancellation, session change and promotion. DOM simulated; no live API calls.');
})().catch(e=>{console.error(e);process.exitCode=1;});
