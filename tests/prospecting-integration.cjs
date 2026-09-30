// Run with: node tests/prospecting-integration.cjs (no dependencies).
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const elements = new Map();
const element = id => {
 if (!elements.has(id)) elements.set(id,{value:'',innerHTML:'',textContent:'',hidden:false,dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return true}},setAttribute(){}});
 return elements.get(id);
};
const ctx = {console,URLSearchParams,setTimeout: fn=>fn(),document:{getElementById:element,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){}},
 leads:[{id:'crm1',empresa:'Existente',codigoUnico:'12345678000199',usuarioId:'u1',tarefas:{},cliente:true}],
 usuarioAtual:{id:'u1',papel:'vendedor'},filtroAdminUsuarioId:null,
 coletorListas:[{id:'list1',nome:'Teste',linhas:[{empresa:'Máquinas Teste',cnpj:'98765432000188',endereco:'Rua Um, Boituva - SP',latitude:-23.28,longitude:-47.67},{empresa:'Duplicado',cnpj:'12.345.678/0001-99'},{empresa:'Sem coordenadas',latitude:'',longitude:''}]}],
 coletorListaAtivaId:'list1',coletorSelecionados:new Set(),coletorPaginaAtual:1,COLETOR_ITENS_POR_PAGINA:30,
 salvarDados(){},salvarDadosDebounced(){},renderizarAll(){},showToast(){},hoje:()=> '2026-09-30',fecharTodosModais(){},svgIcone:()=>'',confirm:()=>true,prompt:()=> 'Fora do perfil'};
let sequence=0;ctx.gerarId=()=> 'id'+(++sequence);ctx.window=ctx;ctx.open=url=>{ctx.lastRoute=url};
vm.createContext(ctx);
for (const file of ['coletor','navigation','prospecting-intelligence','territory-intelligence']) vm.runInContext(fs.readFileSync(root+'/js/'+file+'.js','utf8'),ctx);
ctx.navegarPara('prospeccao');assert.equal(element('reverseProductPanel').hidden,false);
ctx.abrirModoProspeccao('descoberta');assert.equal(element('section-coletor').hidden,false);
ctx.abrirModoProspeccao('mapa');assert.equal(element('section-territory').hidden,false);
assert.equal(ctx.obterEmpresasTerritory().length,3,'CNPJ duplicate collapsed');
const id=ctx.obterEmpresasTerritory().find(l=>l.empresa==='Máquinas Teste').id;
ctx.selecionarLeadTerritory(id);
assert.match(element('territoryProfile').innerHTML,/Análise rápida/);
for(const k of ['activity','process','need','next'])element('prospectingQuick-'+k).value=k==='need'?'Reduzir paradas':'';
ctx.salvarAnaliseProspeccao(id);ctx.qualificarProspeccao(id,'Qualificado');
assert.equal(ctx.obterEmpresasTerritory().find(l=>l.id===id)._status,'Qualificado');
ctx.promoverProspeccao(id);assert.equal(ctx.leads.length,2);
assert.equal(ctx.leads[0].tarefas.territory.lat,-23.28);
assert.equal(ctx.leads[0].tarefas.territory.quick.need,'Reduzir paradas');
ctx.coletorPromoverParaCRM({lista:ctx.coletorListas[0],linhas:[ctx.coletorListas[0].linhas[0]]});
assert.equal(ctx.leads.length,2,'repeated promotion does not duplicate');
assert.equal(ctx.obterEmpresasTerritory().length,3,'promoted discovery represented once');
element('territoryFilterSource').value='discovery';ctx.atualizarFiltrosTerritory();
assert.equal(element('territoryKpiTotal').textContent,1);
assert.equal(element('territoryKpiGeo').textContent,0,'empty coordinates never map to 0,0');
const other=ctx.obterEmpresasTerritory().find(l=>l.empresa==='Sem coordenadas').id;
ctx.qualificarProspeccao(other,'Descartado');assert.equal(element('territoryKpiTotal').textContent,0);
ctx.coletorListas=JSON.parse(JSON.stringify(ctx.coletorListas));
assert.equal(ctx.coletorListas[0].linhas[2].prospecting.reason,'Fora do perfil');
assert.equal(ctx.coletorListas[0].linhas[0].prospecting.crmId,ctx.leads[0].id);
ctx.adicionarRotaProspeccao(ctx.leads[0].id);ctx.abrirRotaProspeccao();
assert.match(ctx.lastRoute,/destination=-23.28%2C-47.67/);
ctx.filtroAdminUsuarioId='another';ctx.usuarioAtual.papel='admin';
assert.equal(ctx.obterEmpresasTerritory().length,0,'seller filter excludes local collector');
console.log('PASS: navigation state, CNPJ deduplication, analysis, qualification, promotion, coordinate preservation, filters, discard, serialization and route URL. DOM simulated; live services and visual layout not tested.');
