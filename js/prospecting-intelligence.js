// Integration adapter: collector rows remain in their lists until explicitly promoted.
(function () {
    const route = [];
    let mode = 'produto';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const digits = value => String(value || '').replace(/\D/g, '');
    function coords(row) {
        const location = row.geometry?.location || row.location || {};
        const lat = row.latitude ?? row.lat ?? location.latitude ?? location.lat;
        const lng = row.longitude ?? row.lng ?? row.lon ?? location.longitude ?? location.lng;
        if (lat === '' || lng === '' || lat == null || lng == null) return {};
        return Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)) && Math.abs(Number(lat)) <= 90 && Math.abs(Number(lng)) <= 180
            ? {lat: Number(lat), lng: Number(lng), source: 'import'} : {};
    }
    function metadata(row) {
        row.prospecting = row.prospecting || {};
        const p = row.prospecting;
        if (!p.id) p.id = gerarId();
        if (!p.territory) p.territory = coords(row);
        p.territory.endereco = row.endereco || '';
        return p;
    }
    function match(row, crm) {
        const id = row.prospecting?.crmId;
        const cnpj = digits(row.cnpj);
        return crm.find(l => (id && l.id === id) || (cnpj.length === 14 && digits(l.cnpj || l.codigoUnico) === cnpj));
    }
    function records(crm) {
        // Respect the admin's selected seller; collector lists are local to this browser.
        if (typeof usuarioAtual === 'undefined' || !usuarioAtual) return [];
        if (typeof filtroAdminUsuarioId !== 'undefined' && filtroAdminUsuarioId && filtroAdminUsuarioId !== usuarioAtual.id) return crm;
        const result = crm.map(l => ({...l, cnpj: l.cnpj || l.codigoUnico, tarefas: l.tarefas || (l.tarefas = {})}));
        const seen = new Set();
        (typeof coletorListas === 'undefined' ? [] : coletorListas).filter(list => !list.reverseOwnerId || String(list.reverseOwnerId) === String(usuarioAtual.id)).forEach(list => list.linhas.forEach(row => {
            if (match(row, crm)) return;
            const p = metadata(row);
            const cnpj = digits(row.cnpj);
            const key = cnpj.length === 14 ? 'cnpj:' + cnpj : row.place_id ? 'place:' + row.place_id : 'row:' + p.id;
            if (seen.has(key)) return;
            seen.add(key);
            const city = coletorExtrairCidadeUF(row.endereco);
            result.push({ id: 'discovery:' + p.id, empresa: row.empresa || row.nome,
                cidade: row.cidade || city.cidade, estado: row.estado || city.estado,
                cnpj: row.cnpj, telefone: row.telefone, whatsapp: row.whatsapp,
                email: row.email, website: row.website, observacoes: [row.categoria, row.observacoes].filter(Boolean).join(' — '),
                potencial: 'B', tarefas: {territory: p.territory}, _discovery: {row, list},
                _status: row.promovido ? 'Promovido' : p.status || (row.tratado ? 'Analisado' : 'Nova descoberta') });
        }));
        return result;
    }
    function find(id) { return window.obterEmpresasTerritory?.().find(l => String(l.id) === String(id)); }
    function save() { salvarDadosDebounced(50); window.renderizarTerritoryIntelligence?.(); }
    function qualify(id, status) {
        const lead = find(id); if (!lead?._discovery) return;
        if (!['Nova descoberta','Analisado','Interessante','Qualificado','Descartado'].includes(status)) return;
        const row = lead._discovery.row, p = metadata(row);
        if (status === 'Descartado') {
            const reason = prompt('Motivo do descarte: fora do perfil, região, duplicidade ou outro motivo');
            if (!reason?.trim()) { window.renderizarTerritoryIntelligence?.(); return; }
            p.reason = reason.trim();
        } else delete p.reason;
        p.status = status; row.tratado = ['Analisado','Interessante','Qualificado'].includes(status);
        save();
    }
    function promote(id) {
        const lead = find(id); if (!lead?._discovery) return;
        const {row, list} = lead._discovery;
        if (lead._status === 'Descartado') return showToast('Requalifique a empresa antes de promover.', 'warning');
        coletorPromoverParaCRM({lista: list, linhas: [row]});
        window.renderizarTerritoryIntelligence?.();
    }
    function profile(lead) {
        const p = lead._discovery ? metadata(lead._discovery.row) : lead.tarefas.territory;
        const dossier = !lead._discovery && typeof mergulhoObterDados === 'function' ? mergulhoObterDados(lead) : null;
        const quick = p.quick || {};
        // Only use populated facts; default dossier fields are not evidence.
        const activity = quick.activity || dossier?.questionario?.focoOperacao || '';
        const process = quick.process || dossier?.campo?.maquinasEquipamentos || '';
        const need = quick.need || dossier?.questionario?.desafioFornecedor || '';
        const next = quick.next || lead.proximaAcao || '';
        const id = esc(JSON.stringify(String(lead.id)));
        return `<details ${window.ReverseProspecting?.getActive() ? '' : 'open'}><summary>Análise geral e dossiê</summary><div class="territory-section-title">Análise rápida</div>
            <p class="text-muted">Resumo editável. Preencha com informações confirmadas na pesquisa ou conversa.</p>
            ${[['activity','Atividade',activity],['process','Processo / equipamentos',process],['need','Necessidade identificada',need],['next','Próxima abordagem',next]].map(([key,label,value]) => `<label class="prospecting-field">${label}<textarea id="prospectingQuick-${key}" rows="2">${esc(value)}</textarea></label>`).join('')}
            <button class="btn btn-primary btn-sm" onclick="salvarAnaliseProspeccao(${id})">Salvar análise</button>
            ${!lead._discovery ? `<button class="btn btn-outline btn-sm" onclick="abrirMergulhoProfundoLead(${id})">Dossiê completo</button>` : ''}
            </details>
            ${lead._discovery ? `<div class="territory-section-title">Qualificação · ${esc(lead._discovery.list.nome)}</div>
            <select aria-label="Qualificação" onchange="qualificarProspeccao(${id},this.value)">${['Nova descoberta','Analisado','Interessante','Qualificado','Descartado','Promovido'].map(s => `<option ${s===lead._status?'selected':''} ${s==='Promovido'?'disabled':''}>${s}</option>`).join('')}</select>
            ${p.reason ? `<p>${esc(p.reason)}</p>` : ''}
            <button class="btn btn-primary btn-sm" ${['Descartado','Promovido'].includes(lead._status)?'disabled':''} onclick="promoverProspeccao(${id})">Promover para CRM</button>` : ''}
            <button class="btn btn-outline btn-sm" onclick="adicionarRotaProspeccao(${id})">Adicionar à rota</button>`;
    }
    function saveQuick(id) {
        const lead = find(id); if (!lead) return;
        const td = lead.tarefas.territory;
        td.quick = Object.fromEntries(['activity','process','need','next'].map(k => [k, document.getElementById('prospectingQuick-' + k).value.trim()]));
        if (!lead._discovery) { const original = leads.find(l => l.id === lead.id); if (original) { original._modificadoLocal = true; original.atualizadoEm = new Date().toISOString(); } }
        save(); showToast('Análise rápida salva.');
    }
    function renderRoute() {
        const el = document.getElementById('prospectingRoutePanel'); if (!el) return;
        const valid = route.map(find).filter(Boolean);
        el.innerHTML = `<h3>Rota de visitas · ${valid.length}/8</h3><p>Ordem manual de visita. Não calcula distância nem otimização de trânsito.</p>` + valid.map((l,i) => `<div class="prospecting-route-row"><span>${i+1}. ${esc(l.empresa)}</span><button class="btn btn-outline btn-sm" onclick="moverRotaProspeccao(${route.indexOf(l.id)},-1)">↑</button><button class="btn btn-outline btn-sm" onclick="moverRotaProspeccao(${route.indexOf(l.id)},1)">↓</button><button class="btn btn-outline btn-sm" onclick="removerRotaProspeccao(${route.indexOf(l.id)})">Remover</button></div>`).join('') + '<button class="btn btn-primary btn-sm" onclick="abrirRotaProspeccao()">Abrir no Google Maps</button>';
    }
    function openMode(next) {
        mode = ['produto','descoberta','empresas','analise','mapa','rotas'].includes(next) ? next : 'produto';
        window.ReverseProspecting?.render();
        const productPanel = document.getElementById('reverseProductPanel');
        if (productPanel) productPanel.hidden = mode !== 'produto';
        document.getElementById('section-coletor').hidden = mode !== 'descoberta';
        document.getElementById('section-territory').hidden = mode === 'descoberta' || mode === 'produto';
        document.getElementById('section-prospeccao').dataset.mode = mode;
        document.querySelectorAll('[id^="prospectingTab-"]').forEach(b => {b.classList.toggle('active',b.id === 'prospectingTab-' + mode); b.setAttribute('aria-selected', b.id === 'prospectingTab-' + mode);});
        document.getElementById('prospectingRoutePanel').hidden = mode !== 'rotas';
        if (mode === 'descoberta') renderizarColetor(); else if (mode !== 'produto') { window.renderizarTerritoryIntelligence?.(); renderRoute(); }
    }
    window.Prospecting = {records, metadata, match, coords, profile};
    window.abrirModoProspeccao = openMode;
    window.qualificarProspeccao = qualify;
    window.promoverProspeccao = promote;
    window.salvarAnaliseProspeccao = saveQuick;
    window.adicionarRotaProspeccao = id => {
        if (!find(id) || route.includes(id)) return;
        if (route.length >= 8) return showToast('Limite de 8 empresas por rota.', 'warning');
        route.push(id); renderRoute(); showToast('Empresa adicionada à rota.');
    };
    window.removerRotaProspeccao = i => {route.splice(i,1);renderRoute();};
    window.moverRotaProspeccao = (i,d) => {const j=i+d;if(j>=0 && j<route.length) [route[i],route[j]]=[route[j],route[i]];renderRoute();};
    window.abrirRotaProspeccao = () => {
        const points = route.map(find).filter(Boolean).map(l => { const td=l.tarefas.territory;return td.lat != null && td.lng != null ? `${td.lat},${td.lng}` : td.endereco || [l.empresa,l.cidade,l.estado].filter(Boolean).join(', '); });
        if (!points.length) return showToast('Adicione empresas à rota.', 'warning');
        const query = new URLSearchParams({api:'1',travelmode:'driving',destination:points.pop()});
        if (points.length) query.set('origin', points.shift());
        if (points.length) query.set('waypoints',points.join('|'));
        window.open('https://www.google.com/maps/dir/?'+query,'_blank','noopener');
    };
})();
