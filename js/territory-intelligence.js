// ============================================
// TERRITORY INTELLIGENCE - MAPA DE PROSPECCAO
// ============================================
(function () {
    const DEFAULT_CENTER = [-23.2856, -47.6786]; // Boituva/SP
    const DEFAULT_ZOOM = 12;
    const GEO_BATCH_LIMIT = 25;
    const GEO_DELAY_MS = 1150;

    const state = {
        map: null,
        markersLayer: null,
        selectedLeadId: null,
        visibleLeads: [],
        isGeocoding: false,
        filters: {
            busca: '',
            cidade: '',
            segmento: '',
            potencial: '',
            status: ''
        }
    };

    function safe(v) {
        return String(v ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        }[c]));
    }

    function normalize(v) {
        return String(v || '').toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function territoryData(lead) {
        lead.tarefas = (lead.tarefas && typeof lead.tarefas === 'object') ? lead.tarefas : {};
        lead.tarefas.territory = (lead.tarefas.territory && typeof lead.tarefas.territory === 'object')
            ? lead.tarefas.territory : {};
        return lead.tarefas.territory;
    }

    function inferirSegmento(lead) {
        const td = territoryData(lead);
        if (td.segmento) return td.segmento;

        const texto = normalize([
            lead.empresa, lead.observacoes, lead.classificacao, lead.cidade
        ].join(' '));

        const regras = [
            ['Plásticos / PET', ['plast', 'pet', 'embalagem', 'sopro', 'injecao']],
            ['Máquinas e Equipamentos', ['maquina', 'equipamento', 'automacao', 'integrador', 'engenharia']],
            ['Metalúrgica', ['metal', 'usinagem', 'estampar', 'solda', 'ferramentaria']],
            ['Automotivo', ['autopec', 'automotiv', 'veiculo', 'caminhao', 'onibus', 'trator']],
            ['Alimentícia', ['alimento', 'bebida', 'envase', 'laticinio', 'frigorifico']],
            ['Química / Farmacêutica', ['quimic', 'farmac', 'cosmet']],
            ['Logística', ['logistic', 'transport', 'armazen']]
        ];

        for (const [segmento, termos] of regras) {
            if (termos.some(t => texto.includes(t))) return segmento;
        }

        const cls = normalize(lead.classificacao);
        if (cls.includes('industrial')) return 'Industrial';
        if (cls.includes('revendedor') || cls.includes('distribuidor')) return 'Canal / Revenda';
        return 'Outros';
    }

    function statusCRM(lead) {
        if (lead._discovery) return lead._status;
        if (lead.cliente || lead.etapa === 'pedido') return 'Cliente';
        const etapa = normalize(lead.etapa);
        if (etapa === 'orcamento' || etapa === 'oportunidades') return 'Em negociação';
        if (etapa === 'qualificacao') return 'Qualificação';
        return 'Prospect';
    }

    function ultimoContato(lead) {
        const h = Array.isArray(lead.historico) ? lead.historico : [];
        if (!h.length) return null;
        const candidatos = h.map(x => {
            const d = x.data || x.created_at || '';
            const hora = x.hora || '00:00';
            const parts = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (parts) return new Date(`${parts[1]}-${parts[2]}-${parts[3]}T${hora}:00`);
            const dt = new Date(d);
            return Number.isNaN(dt.getTime()) ? null : dt;
        }).filter(Boolean);
        if (!candidatos.length) return null;
        return new Date(Math.max(...candidatos.map(d => d.getTime())));
    }

    function diasSemContato(lead) {
        const d = ultimoContato(lead);
        if (!d) return 999;
        return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
    }

    function scoreLead(lead) {
        const td = territoryData(lead);
        if (td.scoreManual != null && td.scoreManual !== '' && Number.isFinite(Number(td.scoreManual))) return Math.max(0, Math.min(100, Number(td.scoreManual)));

        let score = 10;
        if (lead.potencial === 'A') score += 35;
        else if (lead.potencial === 'B') score += 20;
        else score += 8;

        if (lead.etapa === 'orcamento') score += 22;
        else if (lead.etapa === 'oportunidades') score += 18;
        else if (lead.etapa === 'qualificacao') score += 10;
        else if (lead.etapa === 'pedido') score += 15;

        if (lead.whatsapp || lead.telefone) score += 5;
        if (lead.email) score += 4;
        if (lead.decisor) score += 5;
        if (lead.cnpj) score += 3;

        const dias = diasSemContato(lead);
        if (dias <= 15) score += 8;
        else if (dias <= 45) score += 5;
        else if (dias > 90) score += 2;

        return Math.max(0, Math.min(100, score));
    }

    function faixaScore(score) {
        if (score >= 70) return 'Alto';
        if (score >= 45) return 'Médio';
        return 'Baixo';
    }

    function produtosProvaveis(lead) {
        const seg = inferirSegmento(lead);
        const mapa = {
            'Metalúrgica': ['Cilindros pneumáticos', 'Válvulas direcionais', 'FRL', 'Sensores industriais', 'Conexões e mangueiras'],
            'Plásticos / PET': ['Válvulas de sopro PET', 'Cilindros pneumáticos', 'FRL de alta pressão', 'Sensores', 'Vácuo e ventosas'],
            'Máquinas e Equipamentos': ['Atuadores elétricos', 'Cilindros', 'Ilhas de válvulas', 'Sensores', 'Vácuo'],
            'Automotivo': ['Cilindros ISO', 'Válvulas', 'Sensores', 'Atuadores elétricos', 'Preparação de ar'],
            'Alimentícia': ['Atuadores', 'Válvulas', 'FRL', 'Vácuo', 'Sensores'],
            'Química / Farmacêutica': ['Atuadores', 'Válvulas', 'Sensores', 'Preparação de ar'],
            'Canal / Revenda': ['Linha pneumática', 'Conexões', 'Válvulas', 'Cilindros', 'Sensores'],
            'Industrial': ['Cilindros', 'Válvulas', 'FRL', 'Sensores', 'Conexões']
        };
        return mapa[seg] || ['Cilindros', 'Válvulas', 'FRL', 'Sensores', 'Conexões'];
    }

    function leadComGeo(lead) {
        const td = territoryData(lead);
        const lat = Number(td.lat);
        const lng = Number(td.lng);
        return td.lat != null && td.lng != null && td.lat !== '' && td.lng !== '' && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    }

    function crmPermitido() {
        if (typeof leads === 'undefined' || !Array.isArray(leads)) return [];
        if (typeof usuarioAtual !== 'undefined' && usuarioAtual && usuarioAtual.papel !== 'admin') {
            return leads.filter(l => l.usuarioId === usuarioAtual.id);
        }
        if (typeof filtroAdminUsuarioId !== 'undefined' && filtroAdminUsuarioId) {
            return leads.filter(l => l.usuarioId === filtroAdminUsuarioId);
        }
        return leads.slice();
    }

    function leadsPermitidos() {
        return window.Prospecting ? Prospecting.records(crmPermitido()) : crmPermitido();
    }

    function aplicarFiltros(lista) {
        const f = state.filters;
        return lista.filter(lead => {
            if (f.origem && (lead._discovery ? 'discovery' : 'crm') !== f.origem) return false;
            if (!f.status && statusCRM(lead) === 'Descartado') return false;
            const busca = normalize([lead.empresa, lead.cnpj, lead.cidade, lead.estado, lead.decisor, lead.observacoes].join(' '));
            if (f.busca && !busca.includes(normalize(f.busca))) return false;
            if (f.cidade && normalize(lead.cidade) !== normalize(f.cidade)) return false;
            if (f.segmento && inferirSegmento(lead) !== f.segmento) return false;
            if (f.potencial && faixaScore(scoreLead(lead)) !== f.potencial) return false;
            if (f.status && statusCRM(lead) !== f.status) return false;
            return true;
        });
    }

    function initMap() {
        const el = document.getElementById('territoryMap');
        if (!el || typeof L === 'undefined') return;

        if (state.map) {
            setTimeout(() => state.map.invalidateSize(), 50);
            return;
        }

        state.map = L.map(el, { zoomControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(state.map);

        state.markersLayer = L.layerGroup().addTo(state.map);
    }

    function markerHtml(lead) {
        const score = scoreLead(lead);
        const faixa = faixaScore(score);
        const cls = ({Cliente:'client','Em negociação':'negotiation',Prospect:'prospect',Qualificação:'analysis','Nova descoberta':'discovery',Analisado:'analysis',Interessante:'analysis',Qualificado:'analysis',Descartado:'discovery',Promovido:'prospect'})[statusCRM(lead)] || 'discovery';
        return `<div class="territory-marker territory-marker-${cls}" title="${safe(lead.empresa)}"><span>🏭</span></div>`;
    }

    function renderMapMarkers(lista) {
        initMap();
        if (!state.map || !state.markersLayer) return;

        state.markersLayer.clearLayers();
        const bounds = [];

        lista.filter(leadComGeo).forEach(lead => {
            const td = territoryData(lead);
            const icon = L.divIcon({
                className: 'territory-marker-wrap',
                html: markerHtml(lead),
                iconSize: [34, 34],
                iconAnchor: [17, 17]
            });
            const marker = L.marker([Number(td.lat), Number(td.lng)], { icon }).addTo(state.markersLayer);
            marker.bindTooltip(safe(lead.empresa), { direction: 'top', offset: [0, -10] });
            marker.on('click', () => selecionarLeadTerritory(lead.id));
            bounds.push([Number(td.lat), Number(td.lng)]);
        });

        if (bounds.length === 1) state.map.setView(bounds[0], 14);
        else if (bounds.length > 1) state.map.fitBounds(bounds, { padding: [35, 35], maxZoom: 14 });

        setTimeout(() => state.map.invalidateSize(), 60);
    }

    function renderKpis(lista) {
        const total = lista.length;
        const alto = lista.filter(l => scoreLead(l) >= 70).length;
        const medio = lista.filter(l => scoreLead(l) >= 45 && scoreLead(l) < 70).length;
        const geocod = lista.filter(leadComGeo).length;
        const maquinas = lista.filter(l => inferirSegmento(l) === 'Máquinas e Equipamentos').length;
        const plast = lista.filter(l => inferirSegmento(l) === 'Plásticos / PET').length;

        const valores = { territoryKpiTotal: total, territoryKpiHigh: alto, territoryKpiMedium: medio, territoryKpiGeo: geocod, territoryKpiMachines: maquinas, territoryKpiPlastic: plast };
        Object.entries(valores).forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        });
    }

    function renderFiltros(listaBase) {
        const cidadeEl = document.getElementById('territoryFilterCity');
        const segmentoEl = document.getElementById('territoryFilterSegment');
        if (!cidadeEl || !segmentoEl) return;

        const cidades = [...new Set(listaBase.map(l => (l.cidade || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
        const segmentos = [...new Set(listaBase.map(inferirSegmento))].sort((a,b)=>a.localeCompare(b));

        const atualCidade = state.filters.cidade;
        const atualSeg = state.filters.segmento;

        cidadeEl.innerHTML = '<option value="">Todas as cidades</option>' + cidades.map(c => `<option value="${safe(c)}">${safe(c)}</option>`).join('');
        segmentoEl.innerHTML = '<option value="">Todos os segmentos</option>' + segmentos.map(s => `<option value="${safe(s)}">${safe(s)}</option>`).join('');

        cidadeEl.value = atualCidade;
        segmentoEl.value = atualSeg;
    }

    function renderLista(lista) {
        const el = document.getElementById('territoryLeadList');
        if (!el) return;

        if (!lista.length) {
            el.innerHTML = '<div class="territory-empty"><strong>Nenhuma empresa encontrada.</strong><span>Ajuste os filtros ou busque/importe empresas em Descoberta.</span></div>';
            return;
        }

        el.innerHTML = lista
            .slice()
            .sort((a,b) => scoreLead(b) - scoreLead(a))
            .slice(0, 120)
            .map(lead => {
                const score = scoreLead(lead);
                const faixa = faixaScore(score);
                const geo = leadComGeo(lead);
                return `
                <button class="territory-company-row ${state.selectedLeadId === lead.id ? 'active' : ''}" onclick="selecionarLeadTerritory('${safe(lead.id)}')">
                    <div class="territory-company-main">
                        <strong>${safe(lead.empresa || 'Empresa sem nome')}</strong>
                        <span>${safe(statusCRM(lead))} · ${safe(inferirSegmento(lead))} • ${safe(lead.cidade || 'Cidade não informada')}${lead.estado ? '/' + safe(lead.estado) : ''}</span>
                    </div>
                    <div class="territory-company-meta">
                        <span class="territory-score territory-score-${normalize(faixa)}">${score}</span>
                        <span class="territory-geo-dot ${geo ? 'ok' : ''}" title="${geo ? 'Com coordenadas' : 'Sem coordenadas'}"></span>
                    </div>
                </button>`;
            }).join('');
    }

    function renderInsights(lista) {
        const el = document.getElementById('territoryInsights');
        if (!el) return;
        if (!lista.length) {
            el.innerHTML = '<div class="territory-insight">Sem dados suficientes para gerar insights.</div>';
            return;
        }

        const semContato = lista.filter(l => diasSemContato(l) > 90).length;
        const semGeo = lista.filter(l => !leadComGeo(l)).length;
        const alto = lista.filter(l => scoreLead(l) >= 70).length;
        const segmentos = {};
        lista.forEach(l => { const s=inferirSegmento(l); segmentos[s]=(segmentos[s]||0)+1; });
        const topSeg = Object.entries(segmentos).sort((a,b)=>b[1]-a[1])[0];

        el.innerHTML = [
            `<div class="territory-insight"><strong>${alto}</strong><span>empresas com score comercial alto</span></div>`,
            `<div class="territory-insight"><strong>${semContato}</strong><span>empresas sem contato recente (+90d)</span></div>`,
            `<div class="territory-insight"><strong>${semGeo}</strong><span>empresas ainda sem coordenadas no mapa</span></div>`,
            topSeg ? `<div class="territory-insight"><strong>${topSeg[1]}</strong><span>empresas no segmento líder: ${safe(topSeg[0])}</span></div>` : ''
        ].join('');
    }

    function renderProfile(lead) {
        const el = document.getElementById('territoryProfile');
        if (!el) return;
        if (!lead) {
            el.innerHTML = '<div class="territory-profile-placeholder">Selecione uma empresa no mapa ou na lista para abrir a ficha comercial.</div>';
            return;
        }

        const score = scoreLead(lead);
        const faixa = faixaScore(score);
        const td = territoryData(lead);
        const whats = String(lead.whatsapp || lead.telefone || '').replace(/\D/g,'');
        const wa = whats ? (whats.startsWith('55') ? whats : '55' + whats) : '';
        const produtos = produtosProvaveis(lead);
        const dias = diasSemContato(lead);
        const contatoTxt = dias >= 999 ? 'Sem histórico' : (dias === 0 ? 'Hoje' : `${dias} dias atrás`);

        el.innerHTML = `
            <div class="territory-profile-head">
                <div>
                    <span class="territory-chip">${safe(inferirSegmento(lead))}</span>
                    <h2>${safe(lead.empresa || 'Empresa')}</h2>
                    <p>${safe(lead.cnpj || 'CNPJ não informado')}</p>
                </div>
                <div class="territory-score-big">
                    <strong>${score}</strong><span>Score</span>
                </div>
            </div>

            <div class="territory-actions">
                ${wa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener" class="territory-action">💬 WhatsApp</a>` : ''}
                ${lead.telefone ? `<a href="tel:${safe(String(lead.telefone).replace(/[^0-9+]/g,''))}" class="territory-action">📞 Ligar</a>` : ''}
                ${lead.email ? `<a href="mailto:${safe(lead.email)}" class="territory-action">✉️ E-mail</a>` : ''}
                ${!lead._discovery ? `<button class="territory-action" onclick="abrirModalLead('${safe(lead.id)}')">✏️ Abrir no CRM</button>` : ''}
            </div>

            <div class="territory-profile-grid">
                <div><span>Potencial</span><strong>${safe(faixa)}</strong></div>
                <div><span>Situação</span><strong>${safe(statusCRM(lead))}</strong></div>
                <div><span>Cidade</span><strong>${safe((lead.cidade || '—') + (lead.estado ? '/' + lead.estado : ''))}</strong></div>
                <div><span>Último contato</span><strong>${safe(contatoTxt)}</strong></div>
                <div><span>Decisor</span><strong>${safe(lead.decisor || 'Não informado')}</strong></div>
                <div><span>Valor em aberto</span><strong>R$ ${Number(lead.valor || 0).toLocaleString('pt-BR',{minimumFractionDigits:2})}</strong></div>
            </div>

            ${window.Prospecting ? Prospecting.profile(lead) : ''}
            <div class="territory-section-title">Produtos sugeridos · validar aplicação</div>
            <div class="territory-products">${produtos.map(p=>`<span>${safe(p)}</span>`).join('')}</div>

            <div class="territory-section-title">Próxima ação</div>
            <div class="territory-next-action">${safe(lead.proximaAcao || 'Defina a próxima ação comercial no CRM.')}${lead.proximaData ? `<small>${safe(lead.proximaData)}</small>` : ''}</div>

            <div class="territory-profile-footer">
                ${leadComGeo(lead) ? `<button class="btn btn-outline btn-sm" onclick="centralizarLeadTerritory('${safe(lead.id)}')">📍 Centralizar</button>` : `<button class="btn btn-outline btn-sm" onclick="geocodificarLeadTerritory('${safe(lead.id)}')">📍 Localizar no mapa</button>`}
                <button class="btn btn-primary btn-sm" onclick="criarRotaLeadTerritory('${safe(lead.id)}')">🧭 Abrir rota</button>
            </div>
            ${td.geocodedAt ? `<div class="territory-geocode-note">Localização aproximada obtida em ${safe(new Date(td.geocodedAt).toLocaleDateString('pt-BR'))}.</div>` : ''}
        `;
    }

    function selecionarLeadTerritory(id) {
        state.selectedLeadId = id;
        const lead = leadsPermitidos().find(l => String(l.id) === String(id));
        renderProfile(lead || null);
        renderLista(state.visibleLeads);
        if (lead && leadComGeo(lead)) centralizarLeadTerritory(id, false);
    }

    function centralizarLeadTerritory(id, abrirPopup = true) {
        const lead = leadsPermitidos().find(l => String(l.id) === String(id));
        if (!lead || !leadComGeo(lead) || !state.map) return;
        const td = territoryData(lead);
        state.map.flyTo([Number(td.lat), Number(td.lng)], 15, { duration: .6 });
    }

    function construirEndereco(lead) {
        const td = territoryData(lead);
        if (td.endereco) return td.endereco;
        return [lead.empresa, lead.cidade, lead.estado, 'Brasil'].filter(Boolean).join(', ');
    }

    async function geocodificar(lead) {
        const query = construirEndereco(lead);
        if (!query) return false;

        const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q=' + encodeURIComponent(query);
        const resp = await fetch(url, {
            headers: { 'Accept': 'application/json', 'Accept-Language': 'pt-BR,pt;q=0.9' }
        });
        if (!resp.ok) throw new Error('Falha na geocodificação');
        const data = await resp.json();
        if (!Array.isArray(data) || !data.length) return false;

        const td = territoryData(lead);
        td.lat = Number(data[0].lat);
        td.lng = Number(data[0].lon);
        td.displayName = data[0].display_name || query;
        td.geocodedAt = new Date().toISOString();
        lead.atualizadoEm = new Date().toISOString();
        lead._modificadoLocal = true;
        return true;
    }

    async function geocodificarLeadTerritory(id) {
        const lead = leadsPermitidos().find(l => String(l.id) === String(id));
        if (!lead) return;
        try {
            const ok = await geocodificar(lead);
            if (!ok) {
                if (typeof showToast === 'function') showToast('Não foi possível localizar esta empresa. Informe cidade/UF ou endereço no cadastro.', 'error');
                return;
            }
            if (typeof salvarDadosDebounced === 'function') salvarDadosDebounced(50);
            if (typeof showToast === 'function') showToast('Empresa localizada no mapa.');
            renderizarTerritoryIntelligence();
            selecionarLeadTerritory(id);
        } catch (e) {
            console.error(e);
            if (typeof showToast === 'function') showToast('Erro ao consultar localização. Tente novamente mais tarde.', 'error');
        }
    }

    async function geocodificarLoteTerritory() {
        if (state.isGeocoding) return;
        const base = aplicarFiltros(leadsPermitidos()).filter(l => !leadComGeo(l) && (l.cidade || l.estado)).slice(0, GEO_BATCH_LIMIT);
        if (!base.length) {
            if (typeof showToast === 'function') showToast('Todas as empresas filtradas já possuem coordenadas.');
            return;
        }

        state.isGeocoding = true;
        const btn = document.getElementById('territoryGeoBtn');
        if (btn) btn.disabled = true;
        let ok = 0;

        for (let i = 0; i < base.length; i++) {
            if (btn) btn.textContent = `Localizando ${i+1}/${base.length}...`;
            try { if (await geocodificar(base[i])) ok++; } catch(e) { console.warn('Geocodificação falhou', base[i]?.empresa, e); }
            if (i < base.length - 1) await new Promise(r => setTimeout(r, GEO_DELAY_MS));
        }

        state.isGeocoding = false;
        if (btn) { btn.disabled = false; btn.textContent = '📍 Geocodificar empresas'; }
        if (typeof salvarDadosDebounced === 'function') salvarDadosDebounced(50);
        if (typeof showToast === 'function') showToast(`${ok} empresa(s) localizada(s) no mapa.`);
        renderizarTerritoryIntelligence();
    }

    function criarRotaLeadTerritory(id) {
        const lead = leadsPermitidos().find(l => String(l.id) === String(id));
        if (!lead) return;
        const destino = leadComGeo(lead)
            ? `${territoryData(lead).lat},${territoryData(lead).lng}`
            : construirEndereco(lead);
        window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(destino), '_blank', 'noopener');
    }

    function otimizarRotaTerritory() {
        const candidates = state.visibleLeads
            .filter(leadComGeo)
            .sort((a,b)=>scoreLead(b)-scoreLead(a))
            .slice(0, 8);
        if (candidates.length < 2) {
            if (typeof showToast === 'function') showToast('São necessárias ao menos 2 empresas geocodificadas para criar uma rota.', 'error');
            return;
        }
        const coords = candidates.map(l => {
            const td = territoryData(l); return `${td.lat},${td.lng}`;
        });
        const destination = coords.pop();
        const origin = coords.shift();
        const url = 'https://www.google.com/maps/dir/?api=1&travelmode=driving'
            + '&origin=' + encodeURIComponent(origin)
            + '&destination=' + encodeURIComponent(destination)
            + (coords.length ? '&waypoints=' + encodeURIComponent(coords.join('|')) : '');
        window.open(url, '_blank', 'noopener');
    }

    function atualizarFiltrosTerritory() {
        state.filters.origem = document.getElementById('territoryFilterSource')?.value || '';
        state.filters.busca = document.getElementById('territorySearch')?.value || '';
        state.filters.cidade = document.getElementById('territoryFilterCity')?.value || '';
        state.filters.segmento = document.getElementById('territoryFilterSegment')?.value || '';
        state.filters.potencial = document.getElementById('territoryFilterPotential')?.value || '';
        state.filters.status = document.getElementById('territoryFilterStatus')?.value || '';
        renderizarTerritoryIntelligence(false);
    }

    function limparFiltrosTerritory() {
        state.filters = { busca:'', cidade:'', segmento:'', potencial:'', status:'' };
        ['territoryFilterSource','territorySearch','territoryFilterCity','territoryFilterSegment','territoryFilterPotential','territoryFilterStatus'].forEach(id => {
            const el = document.getElementById(id); if (el) el.value = '';
        });
        renderizarTerritoryIntelligence();
    }

    function renderizarTerritoryIntelligence(rebuildFilters = true) {
        const section = document.getElementById('section-territory');
        if (!section) return;

        const base = leadsPermitidos();
        if (rebuildFilters) renderFiltros(base);
        state.visibleLeads = aplicarFiltros(base);

        renderKpis(state.visibleLeads);
        renderMapMarkers(state.visibleLeads);
        renderLista(state.visibleLeads);
        renderInsights(state.visibleLeads);

        const selected = state.selectedLeadId ? base.find(l => String(l.id) === String(state.selectedLeadId)) : null;
        if (selected && state.visibleLeads.some(l => String(l.id) === String(selected.id))) renderProfile(selected);
        else {
            state.selectedLeadId = null;
            renderProfile(null);
        }

        const count = document.getElementById('territoryVisibleCount');
        if (count) count.textContent = `${state.visibleLeads.length} empresa(s) no recorte atual`;
    }

    function handleSearchEnter(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            atualizarFiltrosTerritory();
        }
    }

    window.obterEmpresasTerritory = leadsPermitidos;
    window.renderizarTerritoryIntelligence = renderizarTerritoryIntelligence;
    window.atualizarFiltrosTerritory = atualizarFiltrosTerritory;
    window.limparFiltrosTerritory = limparFiltrosTerritory;
    window.selecionarLeadTerritory = selecionarLeadTerritory;
    window.centralizarLeadTerritory = centralizarLeadTerritory;
    window.geocodificarLeadTerritory = geocodificarLeadTerritory;
    window.geocodificarLoteTerritory = geocodificarLoteTerritory;
    window.criarRotaLeadTerritory = criarRotaLeadTerritory;
    window.otimizarRotaTerritory = otimizarRotaTerritory;
    window.territorySearchEnter = handleSearchEnter;

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && document.getElementById('section-prospeccao')?.classList.contains('active') && state.map) {
            setTimeout(() => state.map.invalidateSize(), 100);
        }
    });
})();
