# Inteligência de Prospecção

Coletor, território e análise rápida agora têm uma única entrada no menu. Modos: Descoberta, Empresas, Análise rápida, Mapa e Rotas. Os atalhos antigos para coletor/territory continuam funcionando.

- Busca Maps e importação CSV continuam usando o coletor existente. A busca abre o mapa ao terminar. Resultados sem coordenadas permanecem na lista até localização.
- Latitude/longitude retornadas pela busca ou importadas por CSV são aproveitadas. Coordenadas vazias ou fora do intervalo não são aceitas.
- Descobertas aparecem junto ao CRM sem promoção prévia. Vínculo confirmado ou CNPJ completo elimina a duplicação visual. Nome e telefone não mesclam empresas automaticamente.
- Qualificação: nova descoberta, analisado, interessante, qualificado, descartado com motivo. Descartadas ficam ocultas no filtro padrão; podem ser recuperadas pelo filtro de status.
- Promoção individual ou em lote preserva endereço, coordenadas e análise rápida, com vínculo ao lead criado. Repetir a promoção não duplica o lead.
- Análise rápida: atividade, processo/equipamentos, necessidade e próxima abordagem. Aproveita campos preenchidos do dossiê existente; pode ser editada antes ou depois da promoção. O dossiê completo permanece acessível na ficha do CRM, com botão de retorno.
- Rotas: selecionar até 8 empresas, ordenar manualmente, remover e abrir no Google Maps. A rota por prioridade existente ordena por score; não é otimização geográfica ou de trânsito.

## Persistência e limites

A integração reutiliza a persistência existente: listas do coletor no cache local e metadados do CRM em tarefas.territory. Não acrescenta sincronização multi-dispositivo das listas, nova tabela, IA, busca de semelhantes ou disparos de campanhas. A seleção temporária de rota não é persistida. O filtro administrativo de outro vendedor não inclui listas locais do coletor.

Score, segmento e produtos são inferências por regras, não fatos verificados. A busca ainda depende da Edge Function buscar-leads-maps e de sua configuração; o código dessa função não existe neste repositório. Nenhuma consulta externa ou mensagem comercial foi executada durante a implementação.

## Validação

Executar: `node tests/prospecting-integration.cjs`.

Teste sem dependências com DOM simulado: navegação, deduplicação, qualificação, análise rápida, promoção, preservação de coordenadas, filtros, descarte, serialização, rota e filtro por vendedor. Sintaxe JavaScript e diff verificados. A validação visual em navegador e as integrações reais com Supabase/Maps ficam pendentes: o download do navegador de teste falhou no ambiente.

Antes do merge, verificar em preview autenticado: busca real, importação CSV, mapa, análise rápida, promoção, retorno do dossiê, logout/login, salvamento e responsividade. Não executar migração SQL para este recurso.
