// Pure matching rules. Scores rank recorded evidence, never purchase probability.
(function (root) {
    'use strict';
    const normalize = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const digits = v => String(v ?? '').replace(/\D/g, '');
    const terms = v => [...new Set((Array.isArray(v) ? v : String(v || '').split(/[\n;,]/)).map(x => String(x).trim()).filter(Boolean))].slice(0, 30);
    const contains = (text, term) => (' ' + normalize(text) + ' ').includes(' ' + normalize(term) + ' ');
    const presets = [
        {id:'pet',name:'Válvula de sopro PET',targets:['Fabricantes de máquinas de sopro PET','Fabricantes de embalagens PET'],keywords:['sopro PET','sopradora','sopro de garrafas','garrafas PET'],excluded:['reciclagem de PET'],application:'Comando pneumático em máquinas de sopro PET; validar pressão, vazão e ciclo.',question:'Vocês fabricam sopradoras ou utilizam essas máquinas? Qual pressão e ciclo da aplicação?'},
        {id:'linear',name:'Cilindro sem haste',targets:['Fabricantes de máquinas de embalagem','Fabricantes de máquinas especiais'],keywords:['transferência de peças','movimentação linear','alimentação de máquinas','cilindro sem haste'],excluded:[],application:'Transferência linear com restrição de espaço; validar carga, curso e guiamento.',question:'Qual curso e carga precisam movimentar? Há restrição de espaço ou necessidade de guia?'},
        {id:'electric',name:'Atuador elétrico',targets:['Fabricantes de máquinas especiais','Integradores de automação'],keywords:['posicionamento','servomotor','controle de posição','automação de montagem'],excluded:[],application:'Posicionamento controlado; validar força, velocidade, repetibilidade e comando.',question:'O movimento exige posições intermediárias ou controle de força? Quais carga e velocidade?'},
        {id:'vacuum',name:'Vácuo e ventosas',targets:['Fabricantes de máquinas de embalagem','Integradores de robótica'],keywords:['paletização','pick and place','manipulação de chapas','cartonagem','ventosas'],excluded:[],application:'Pega e transferência de peças; validar superfície, peso e cadência.',question:'Qual material, peso e superfície serão manipulados? Qual cadência de trabalho?'},
        {id:'air',name:'Preparação e tratamento de ar',targets:['Fabricantes de máquinas','Empresas de manutenção industrial'],keywords:['ar comprimido','rede pneumática','tratamento de ar','pneumática'],excluded:[],application:'Preparação do ar de máquinas; validar vazão, pressão e qualidade exigida.',question:'Há água, partículas ou queda de pressão no ponto de uso? Qual vazão necessária?'},
        {id:'iso',name:'Cilindros pneumáticos',targets:['Fabricantes de máquinas especiais','Metalúrgicas','Indústrias de montagem'],keywords:['cilindros pneumáticos','fixação de peças','alimentadores','prensas pneumáticas'],excluded:[],application:'Fixação e movimentação; validar diâmetro, curso, força e montagem.',question:'É reposição ou projeto novo? Quais diâmetro, curso e fixação do cilindro?'}
    ];
    function catalogProfiles(data = {}) {
        return (data.produtos || []).filter(p=>p.ativo !== false).map(p => {
            const subsub=(data.subsubcategorias || []).find(x=>x.id===p.subsubcategoriaId);
            const sub=(data.subcategorias || []).find(x=>x.id===subsub?.subcategoriaId);
            const cat=(data.categorias || []).find(x=>x.id===sub?.categoriaId);
            const chain=[p,subsub,sub,cat].filter(Boolean);
            const ownTargets=terms(p.clientesAlvo);
            return {id:'catalog:'+p.id,name:p.nome || p.codigo || 'Produto',code:p.codigo || '',
                targets:ownTargets.length?ownTargets:terms(chain.flatMap(x=>x.clientesAlvo || [])),
                keywords:terms([...(p.palavrasChave || []),...(p.aplicacoesIndustriais || [])]),
                cnaes:terms(chain.flatMap(x=>x.cnaesRelacionados || [])),excluded:[],
                application:terms(p.aplicacoesIndustriais).join('; ') || p.descricao || '',
                question:'Qual aplicação, condição de trabalho e requisito técnico precisamos validar?',source:'Catálogo cadastrado (revise dados demonstrativos)'};
        });
    }
    function ddd(phone) {
        let n=digits(phone);if(n.startsWith('55') && n.length>=12)n=n.slice(2);
        return n.length===10 || n.length===11 ? n.slice(0,2) : '';
    }
    function clean(raw) {
        return {id:String(raw.id || 'custom').slice(0,160),name:String(raw.name || '').trim().slice(0,180),
            targets:terms(raw.targets),keywords:terms(raw.keywords),cnaes:terms(raw.cnaes).map(digits).filter(x=>x.length>=2 && x.length<=7),
            excluded:terms(raw.excluded),application:String(raw.application || '').trim().slice(0,1200),question:String(raw.question || '').trim().slice(0,500),
            city:String(raw.city || '').trim().slice(0,100),uf:String(raw.uf || '').trim().toUpperCase().slice(0,2),
            ddds:terms(raw.ddds).map(digits).filter(x=>x.length===2),minScore:Math.max(0,Math.min(100,Number(raw.minScore)||0))};
    }
    function evaluate(lead, profile) {
        const td=lead.tarefas?.territory || {};
        const saved=td.reverse?.assessments?.[profile.id];
        const row=lead._discovery?.row || lead;
        // Do not include search terms/provenance or generated product suggestions in evidence.
        const fields=[['Empresa',lead.empresa],['Categoria',row.categoria || lead.classificacao],['Observações',lead.observacoes],['Análise rápida',td.quick?.process],['Atividade registrada',td.quick?.activity]];
        const matches=[];
        const scan=list=>terms(list).filter(term=>{
            const field=fields.find(([,value])=>value && contains(value,term));
            if(field)matches.push({term,field:field[0]});return !!field;
        });
        const process=scan(profile.keywords);
        const segments=scan(profile.targets);
        const cnaes=terms(row.cnaes || row.cnae || lead.cnaePrincipal || '').map(digits);
        const matchingCnaes=(profile.cnaes || []).filter(prefix=>cnaes.some(c=>c.startsWith(digits(prefix))));
        const negatives=(profile.excluded || []).filter(term=>fields.some(([,value])=>value && contains(value,term)));
        let score=Math.min(80,Math.min(60,process.length*30)+Math.min(20,segments.length*10)+Math.min(20,matchingCnaes.length*20));
        let status=score ? 'Indícios a validar' : 'Sem evidência suficiente';
        if(negatives.length){score=0;status='Revisar exclusão';}
        if(saved?.status==='confirmed'){score=100;status='Aplicação confirmada';}
        if(saved?.status==='rejected'){score=0;status='Sem aplicação';}
        const quality=[lead.cnpj && digits(lead.cnpj).length===14,lead.telefone || lead.whatsapp,lead.email,lead.cidade,td.lat!=null && td.lng!=null].filter(Boolean).length*20;
        return {score,status,matches,cnaes:matchingCnaes,negatives,quality,saved};
    }
    function inTerritory(lead, profile) {
        if(profile.city && normalize(lead.cidade)!==normalize(profile.city))return false;
        if(profile.uf && normalize(lead.estado)!==normalize(profile.uf))return false;
        if(profile.ddds.length && !profile.ddds.includes(ddd(lead.telefone)) && !profile.ddds.includes(ddd(lead.whatsapp)))return false;
        return true;
    }
    function queries(profile) {
        const locality=[profile.city,profile.uf].filter(Boolean).join(', ');
        return terms(profile.targets).slice(0,6).map(term=>locality?`${term} em ${locality}`:term);
    }
    const api={normalize,digits,terms,contains,presets,catalogProfiles,ddd,clean,evaluate,inTerritory,queries};
    root.ReverseProspectingModel=api;
    if(typeof module!=='undefined' && module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
