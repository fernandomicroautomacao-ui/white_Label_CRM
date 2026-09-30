# Prospecção Reversa

A entrada principal de prospecção passa a começar pelo produto, substituindo o fluxo genérico de Inteligência de Prospecção. Mantém coletor, empresas, análise rápida, mapa, rotas e acesso ao dossiê completo.

## Uso

1. Abra Prospecção Reversa > Produto e aplicação.
2. Selecione um produto do catálogo, um dos seis roteiros editáveis ou um produto personalizado. Os roteiros não certificam aplicações ou especificações; o catálogo existente pode conter dados demonstrativos.
3. Revise aplicações, pergunta de qualificação, tipos de empresa, palavras-chave, CNAEs e termos de exclusão.
4. Informe cidade/UF, DDDs e aderência mínima. Cidade/UF e DDDs são combinados: registros sem dados suficientes ficam fora do recorte. Para analisar a base inteira, deixe os filtros territoriais vazios.
5. Use Analisar minha base, sem consultas externas, ou Buscar novas empresas, que chama buscar-leads-maps para até seis tipos de empresa na cidade/UF escolhida. A busca pode consumir a cota do serviço configurado.
6. Selecione uma empresa, leia os motivos da aderência e pesquise/registre a aplicação. Confirmar ou rejeitar exige evidência e fonte/contato.
7. Promova uma descoberta ao CRM ou defina uma próxima ação e data para um lead existente. As validações são específicas de cada produto.

## Aderência explicável

- Até 60 pontos por termos de aplicação encontrados nos dados cadastrados (30 por termo).
- Até 20 por tipos de empresa identificados (10 por termo).
- Até 20 por CNAEs compatíveis (20 por prefixo). Critérios herdados do catálogo devem ser revisados.
- Indícios automáticos ficam limitados a 80/100; não significam probabilidade de compra.
- Aplicação confirmada pelo vendedor, com evidência/fonte, recebe 100. Aplicação rejeitada recebe 0.
- Termos de exclusão zeram a aderência automática e exigem revisão; não apagam ou descartam globalmente o lead. Uma confirmação explícita pode prevalecer sobre o indício de exclusão.
- O texto da consulta, o produto selecionado e sugestões geradas não entram como evidência.
- Cadastro preenchido é um indicador separado de completude, não de validade dos contatos.

## Busca e persistência

Reaproveita a Edge Function existente buscar-leads-maps; seu código não está neste repositório. Espera `data.resultados`, com campos de empresa/endereço/contato; aceita coordenadas diretas ou em location/geometry.location. Não adiciona chaves ao navegador.

Consultas são sequenciais, com limite de seis por execução e timeout de 45 segundos por consulta. Falhas parciais preservam resultados recebidos. Interromper impede novas consultas e ignora a resposta pendente; não cancela a cobrança de uma requisição já enviada ao fornecedor.

Deduplicação entre listas acessíveis por CNPJ completo, Place ID ou empresa+endereço. A promoção/representação no CRM usa vínculo confirmado ou CNPJ. Nomes e telefones isolados não mesclam empresas.

Planos ficam no localStorage por usuário (`crm_reverse_prospecting_v1:<id>`). Descobertas usam as listas locais existentes; listas criadas por esta busca têm proprietário e são ocultadas de outros usuários no coletor/mapa. Listas antigas sem proprietário mantêm o comportamento legado; isto não constitui uma migração completa de isolamento do coletor.

Origem e validação ficam em `row.prospecting.territory.reverse` e, após promoção, `lead.tarefas.territory.reverse`. A promoção conserva coordenadas, CNPJ, análise e evidências. Validações do CRM marcam o lead como modificado para a sincronização existente. Nenhuma migração SQL é necessária. Planos/listas locais não passam a ter sincronização multi-dispositivo ou backup automático adicional.

Troca de usuário invalida o plano ativo e ignora respostas de uma busca anterior. O plano salvo é restaurado para edição, exigindo aplicação explícita antes de filtrar novamente.

## Limites

Não realiza pesquisa autônoma de websites, verificação de e-mails, análise por IA, identificação de decisores, disparo de mensagens ou otimização de trânsito. Links de pesquisa e site ajudam na validação manual. O enriquecimento de contatos depende da capacidade da Edge Function existente. Rotas são ordenadas manualmente; seleção de rota é temporária.

A confirmação da aplicação não certifica compatibilidade técnica do produto: pressão, vazão, curso, carga, montagem e demais condições continuam sujeitos à validação comercial/técnica.

## Validação executada

- `node tests/prospecting-integration.cjs`
- `node tests/reverse-prospecting.cjs`
- `node --check` nos scripts alterados e `git diff --check`.

Testes com DOM simulado e respostas mockadas, sem acesso a dados reais: navegação, catálogo, normalização, aderência, território/DDD, evidência obrigatória, validação por produto, próxima ação, renderização escapada, respostas parciais, repetição, cancelamento, troca de usuário, isolamento de listas novas e preservação ao promover.

Validação visual, layout responsivo e integrações autenticadas reais permanecem pendentes: o navegador de teste não estava disponível e seu download falhou no ambiente. Antes do merge, verificar em preview com a configuração real: busca Maps, mapa, catálogo, importação CSV, validação por produto, promoção, sincronização, logout/login e retorno do dossiê. Nenhum merge/deploy ou alteração de banco foi realizado.
