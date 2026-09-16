// =========================================================================
// RELATÓRIO OFICIAL DE ORÇAMENTOS E PERDIDOS EM EXCEL (XLS / XLSX)
// =========================================================================
// Padrão visual e estrutural definido conforme layout homologado:
//
// 1º Aba / Formato (Orçamentos):
// [Vendedor] [Cliente] [Valor] [Nro. Orçamento] [Probabilidade de fechamento] [Comentários]
//
// 2º Aba / Formato (Perdidos):
// [Vendedor] [Cliente] [Valor] [Nro. Orçamento] [Concorrente] [Comentários] [Motivo]
// =========================================================================

(function () {
    'use strict';

    // -------------------------------------------------------------
    // Helpers de Formatação e Extração de Dados
    // -------------------------------------------------------------

    function obterNomeVendedor(leadOuPerdido) {
        if (!leadOuPerdido) return 'Fernando Feitosa';
        if (leadOuPerdido.vendedor && typeof leadOuPerdido.vendedor === 'string' && leadOuPerdido.vendedor.trim()) {
            return leadOuPerdido.vendedor.trim();
        }
        if (leadOuPerdido.usuarioId && typeof usuarios !== 'undefined' && Array.isArray(usuarios)) {
            const u = usuarios.find(user => user.id === leadOuPerdido.usuarioId);
            if (u && u.nome) return u.nome;
        }
        if (typeof usuarioAtual !== 'undefined' && usuarioAtual && usuarioAtual.nome) {
            return usuarioAtual.nome;
        }
        return 'Fernando Feitosa';
    }

    function obterNomeCliente(item) {
        if (!item) return '';
        return (item.empresa || item.nomeCliente || item.razaoSocial || item.nome || '').trim();
    }

    function obterNumeroOrcamento(item) {
        if (!item) return '';
        // 1. Campo explícito
        if (item.numeroOrcamento) return String(item.numeroOrcamento).trim();
        if (item.nroOrcamento) return String(item.nroOrcamento).trim();
        if (item.orcamentoNumero) return String(item.orcamentoNumero).trim();
        // 2. Extraído do PDF de proposta anexado
        if (item.orcamentoPdfPrincipal && item.orcamentoPdfPrincipal.dadosExtraidos && item.orcamentoPdfPrincipal.dadosExtraidos.numero) {
            return String(item.orcamentoPdfPrincipal.dadosExtraidos.numero).trim();
        }
        // 3. Primeiro orçamento da lista interna
        if (Array.isArray(item.orcamentos) && item.orcamentos.length > 0 && item.orcamentos[0].numero) {
            return String(item.orcamentos[0].numero).trim();
        }
        // 4. Número de pedido pré-gerado
        if (item.numeroPedido) return String(item.numeroPedido).trim();
        // 5. Código legível do lead
        if (item.codigoUnico) return String(item.codigoUnico).trim();
        if (item.id) {
            const digits = String(item.id).replace(/\D/g, '');
            if (digits.length >= 4) return '0' + digits.slice(0, 5);
        }
        return '';
    }

    function obterProbabilidadeFechamento(lead) {
        if (!lead) return 'media';
        if (lead.probabilidade) {
            const p = String(lead.probabilidade).toLowerCase().trim();
            if (p.includes('alt')) return 'alta';
            if (p.includes('baix')) return 'baixa';
            return 'media';
        }
        // Mapeia potencial comercial (A = alta, B = média, C = baixa)
        const pot = String(lead.potencial || '').toLowerCase().trim();
        if (pot === 'a' || pot.includes('alt')) return 'alta';
        if (pot === 'c' || pot.includes('baix')) return 'baixa';
        return 'media';
    }

    function obterComentariosOrcamento(lead) {
        if (!lead) return '';
        if (lead.comentarios && typeof lead.comentarios === 'string' && lead.comentarios.trim()) {
            return lead.comentarios.trim();
        }

        const partes = [];

        // 1. Resumo dos itens do orçamento
        if (Array.isArray(lead.itens) && lead.itens.length > 0) {
            const itensDesc = lead.itens
                .map(i => {
                    let d = (i.descricao || i.nome || i.codigo || '').trim();
                    if (i.quantidade && Number(i.quantidade) > 1) d += ` (${i.quantidade}x)`;
                    return d;
                })
                .filter(Boolean)
                .join(', ');
            if (itensDesc) partes.push(itensDesc);
        }

        // 2. Condições comerciais (ex.: A vista, 28 DDL)
        if (lead.condicoes && typeof lead.condicoes === 'string' && lead.condicoes.trim()) {
            partes.push(lead.condicoes.trim());
        } else if (lead.obsOrcamento && typeof lead.obsOrcamento === 'string' && lead.obsOrcamento.trim()) {
            partes.push(lead.obsOrcamento.trim());
        } else if (lead.cardObs && typeof lead.cardObs === 'string' && lead.cardObs.trim()) {
            partes.push(lead.cardObs.trim());
        }

        if (partes.length > 0) {
            return partes.join(' - ');
        }

        return (lead.descricao || lead.observacoes || 'Orçamento em negociação').trim();
    }

    function obterConcorrentePerdido(perdido) {
        if (!perdido) return '';
        if (perdido.concorrente && typeof perdido.concorrente === 'string' && perdido.concorrente.trim()) {
            return perdido.concorrente.trim();
        }
        if (perdido.concorrencia && typeof perdido.concorrencia === 'string' && perdido.concorrencia.trim()) {
            return perdido.concorrencia.trim();
        }
        // Se detalhe do motivo mencionar concorrente
        if (perdido.motivoDetalhe && typeof perdido.motivoDetalhe === 'string') {
            const lower = perdido.motivoDetalhe.toLowerCase();
            if (lower.includes('festo') || lower.includes('smc') || lower.includes('parker') || lower.includes('camozzi') || lower.includes('micro') || lower.includes('norgren')) {
                return perdido.motivoDetalhe.trim();
            }
        }
        return '';
    }

    function obterComentariosPerdido(perdido) {
        if (!perdido) return '';
        if (perdido.comentarios && typeof perdido.comentarios === 'string' && perdido.comentarios.trim()) {
            return perdido.comentarios.trim();
        }

        const partes = [];

        // 1. Itens do orçamento se houver
        if (Array.isArray(perdido.itens) && perdido.itens.length > 0) {
            const itensDesc = perdido.itens
                .map(i => (i.descricao || i.nome || i.codigo || '').trim())
                .filter(Boolean)
                .join(', ');
            if (itensDesc) partes.push(itensDesc);
        }

        // 2. Observações ou detalhes
        if (perdido.motivoDetalhe && typeof perdido.motivoDetalhe === 'string' && perdido.motivoDetalhe.trim()) {
            partes.push(perdido.motivoDetalhe.trim());
        } else if (perdido.cardObs && typeof perdido.cardObs === 'string' && perdido.cardObs.trim()) {
            partes.push(perdido.cardObs.trim());
        } else if (perdido.observacoes && typeof perdido.observacoes === 'string' && perdido.observacoes.trim()) {
            partes.push(perdido.observacoes.trim());
        }

        if (partes.length > 0) {
            return partes.join(' - ');
        }

        return (perdido.motivo || 'Card descartado').trim();
    }

    function obterMotivoPerdido(perdido) {
        if (!perdido) return 'Perdido por preço';
        return (perdido.motivo || 'Perdido por preço').trim();
    }

    // -------------------------------------------------------------
    // Coletores de Registros Filtrados ou Globais
    // -------------------------------------------------------------

    function coletarDadosOrcamentos() {
        let lista = [];

        // Se estiver na tela de relatórios detalhados com função de filtro disponível
        if (typeof filtrarOrcamentosAbertosComDetalhes === 'function') {
            try {
                const res = filtrarOrcamentosAbertosComDetalhes();
                if (res && Array.isArray(res.lista) && res.lista.length > 0) {
                    lista = res.lista;
                }
            } catch (e) {
                console.warn('Fallback para lista de leads global em orçamentos:', e);
            }
        }

        // Fallback: todos os leads na etapa "orcamento" ou que possuam valor e proposta
        if (!lista || lista.length === 0) {
            const todosLeads = (typeof leads !== 'undefined' && Array.isArray(leads)) ? leads : [];
            lista = todosLeads.filter(l => {
                return l.etapa === 'orcamento' ||
                       (l.etapa !== 'pedido' && l.etapa !== 'ganho' && (l.valor > 0 || l.numeroOrcamento || (l.itens && l.itens.length > 0)));
            });
        }

        return lista.map(lead => {
            const valorNum = parseFloat(lead.valor) || 0;
            return {
                vendedor: obterNomeVendedor(lead),
                cliente: obterNomeCliente(lead),
                valor: valorNum,
                valorFormatado: `R$ ${valorNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                nroOrcamento: obterNumeroOrcamento(lead),
                probabilidade: obterProbabilidadeFechamento(lead),
                comentarios: obterComentariosOrcamento(lead)
            };
        });
    }

    function coletarDadosPerdidos() {
        let lista = [];

        // Se estiver no painel com filtros de perdidos ativos
        if (typeof filtrarPerdidosComDetalhes === 'function') {
            try {
                const res = filtrarPerdidosComDetalhes();
                if (res && Array.isArray(res.lista) && res.lista.length > 0) {
                    lista = res.lista;
                }
            } catch (e) {
                console.warn('Fallback para lista global de perdidos:', e);
            }
        }

        if (!lista || lista.length === 0 && typeof obterPerdidosFiltrados === 'function') {
            try {
                const res = obterPerdidosFiltrados();
                if (res && Array.isArray(res.lista) && res.lista.length > 0) {
                    lista = res.lista;
                }
            } catch (e) {
                console.warn('Fallback para perdidos array:', e);
            }
        }

        if (!lista || lista.length === 0) {
            lista = (typeof perdidos !== 'undefined' && Array.isArray(perdidos)) ? perdidos : [];
        }

        return lista.map(p => {
            const valorNum = parseFloat(p.valor) || 0;
            return {
                vendedor: obterNomeVendedor(p),
                cliente: obterNomeCliente(p),
                valor: valorNum,
                valorFormatado: `R$ ${valorNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                nroOrcamento: obterNumeroOrcamento(p),
                concorrente: obterConcorrentePerdido(p),
                comentarios: obterComentariosPerdido(p),
                motivo: obterMotivoPerdido(p)
            };
        });
    }

    // -------------------------------------------------------------
    // Geração de HTML XLS com Cabeçalho Cinza e Bordas Pretas
    // (Fiel 100% ao design enviado nas imagens do usuário)
    // -------------------------------------------------------------

    function gerarTabelaHtmlOrcamento(dados) {
        const linhasHtml = dados.map(item => `
            <tr>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.vendedor)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.cliente)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: right; mso-number-format:'\\R\\$\\ \\#\\,\\#\\#0\\.00';">${item.valor.toFixed(2).replace('.', ',')}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: center; mso-number-format:'\\@';">${escaparHtml(item.nroOrcamento)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: center; mso-number-format:'\\@';">${escaparHtml(item.probabilidade)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.comentarios)}</td>
            </tr>
        `).join('');

        return `
            <table style="border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 11pt; width: 100%;">
                <thead>
                    <tr>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Vendedor</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Cliente</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: center;">Valor</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: center;">Nro. Orçamento</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: center;">Probabilidade de fechamento</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Comentários</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhasHtml}
                </tbody>
            </table>
        `;
    }

    function gerarTabelaHtmlPerdidos(dados) {
        const linhasHtml = dados.map(item => `
            <tr>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.vendedor)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.cliente)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: right; mso-number-format:'\\R\\$\\ \\#\\,\\#\\#0\\.00';">${item.valor.toFixed(2).replace('.', ',')}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: center; mso-number-format:'\\@';">${escaparHtml(item.nroOrcamento)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.concorrente)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.comentarios)}</td>
                <td style="border: 1px solid #000000; padding: 4px 8px; text-align: left; mso-number-format:'\\@';">${escaparHtml(item.motivo)}</td>
            </tr>
        `).join('');

        return `
            <table style="border-collapse: collapse; font-family: Calibri, Arial, sans-serif; font-size: 11pt; width: 100%;">
                <thead>
                    <tr>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Vendedor</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Cliente</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: center;">Valor</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: center;">Nro. Orçamento</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Concorrente</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Comentários</th>
                        <th style="background-color: #BFBFBF; color: #000000; font-weight: bold; border: 1px solid #000000; padding: 6px 8px; text-align: left;">Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    ${linhasHtml}
                </tbody>
            </table>
        `;
    }

    function dispararDownloadArquivo(conteudo, nomeArquivo, mimeType) {
        const blob = new Blob([conteudo], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nomeArquivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    }

    function escaparHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function obterDataHojeFormatada() {
        return new Date().toISOString().split('T')[0];
    }

    // -------------------------------------------------------------
    // GERAÇÃO SHEETJS (XLSX COM AS DUAS ABAS OU INDIVIDUAIS)
    // -------------------------------------------------------------

    function exportarComSheetJS(opcoes) {
        if (typeof XLSX === 'undefined') {
            return false; // fallback para HTML XLS
        }

        const wb = XLSX.utils.book_new();

        if (opcoes.incluirOrcamentos) {
            const cabecalhoOrc = ['Vendedor', 'Cliente', 'Valor', 'Nro. Orçamento', 'Probabilidade de fechamento', 'Comentários'];
            const linhasOrc = opcoes.dadosOrcamentos.map(d => [
                d.vendedor,
                d.cliente,
                d.valor,
                d.nroOrcamento, // armazenado como string para preservar zeros à esquerda como '078140'
                d.probabilidade,
                d.comentarios
            ]);

            const wsOrc = XLSX.utils.aoa_to_sheet([cabecalhoOrc, ...linhasOrc]);

            // Definir larguras de colunas
            wsOrc['!cols'] = [
                { wch: 22 }, // Vendedor
                { wch: 38 }, // Cliente
                { wch: 14 }, // Valor
                { wch: 16 }, // Nro. Orçamento
                { wch: 26 }, // Probabilidade
                { wch: 55 }  // Comentários
            ];

            // Formatação do tipo de célula para Valor e Número do Orçamento
            const rangeOrc = XLSX.utils.decode_range(wsOrc['!ref']);
            for (let R = 1; R <= rangeOrc.e.r; ++R) {
                // Coluna C: Valor
                const cellRefValor = XLSX.utils.encode_cell({ r: R, c: 2 });
                if (wsOrc[cellRefValor]) {
                    wsOrc[cellRefValor].t = 'n';
                    wsOrc[cellRefValor].z = '"R$" #,##0.00';
                }
                // Coluna D: Nro. Orçamento (Tipo string com triângulo verde no Excel se for numérico com zero à esquerda)
                const cellRefNro = XLSX.utils.encode_cell({ r: R, c: 3 });
                if (wsOrc[cellRefNro]) {
                    wsOrc[cellRefNro].t = 's';
                }
            }

            XLSX.utils.book_append_sheet(wb, wsOrc, 'Orçamentos');
        }

        if (opcoes.incluirPerdidos) {
            const cabecalhoPerd = ['Vendedor', 'Cliente', 'Valor', 'Nro. Orçamento', 'Concorrente', 'Comentários', 'Motivo'];
            const linhasPerd = opcoes.dadosPerdidos.map(d => [
                d.vendedor,
                d.cliente,
                d.valor,
                d.nroOrcamento,
                d.concorrente,
                d.comentarios,
                d.motivo
            ]);

            const wsPerd = XLSX.utils.aoa_to_sheet([cabecalhoPerd, ...linhasPerd]);

            wsPerd['!cols'] = [
                { wch: 22 }, // Vendedor
                { wch: 38 }, // Cliente
                { wch: 14 }, // Valor
                { wch: 16 }, // Nro. Orçamento
                { wch: 20 }, // Concorrente
                { wch: 50 }, // Comentários
                { wch: 24 }  // Motivo
            ];

            const rangePerd = XLSX.utils.decode_range(wsPerd['!ref']);
            for (let R = 1; R <= rangePerd.e.r; ++R) {
                const cellRefValor = XLSX.utils.encode_cell({ r: R, c: 2 });
                if (wsPerd[cellRefValor]) {
                    wsPerd[cellRefValor].t = 'n';
                    wsPerd[cellRefValor].z = '"R$" #,##0.00';
                }
                const cellRefNro = XLSX.utils.encode_cell({ r: R, c: 3 });
                if (wsPerd[cellRefNro]) {
                    wsPerd[cellRefNro].t = 's';
                }
            }

            XLSX.utils.book_append_sheet(wb, wsPerd, 'Perdidos');
        }

        XLSX.writeFile(wb, opcoes.nomeArquivo);
        return true;
    }

    // -------------------------------------------------------------
    // FUNÇÕES PÚBLICAS DE EXPORTAÇÃO
    // -------------------------------------------------------------

    /**
     * Exporta 1º Formato: Orçamentos em XLS/XLSX
     * Colunas: Vendedor | Cliente | Valor | Nro. Orçamento | Probabilidade de fechamento | Comentários
     */
    function exportarXlsOrcamentos() {
        const dados = coletarDadosOrcamentos();
        if (dados.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Nenhum orçamento encontrado para exportar.', 'error');
            } else {
                alert('Nenhum orçamento encontrado para exportar.');
            }
            return;
        }

        const nomeArquivo = `Relatorio_Orcamentos_${obterDataHojeFormatada()}.xlsx`;
        const sucesso = exportarComSheetJS({
            incluirOrcamentos: true,
            incluirPerdidos: false,
            dadosOrcamentos: dados,
            nomeArquivo: nomeArquivo
        });

        if (!sucesso) {
            // Fallback direto para formato XLS nativo em HTML formatado
            const html = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Orçamentos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                </head>
                <body>
                    ${gerarTabelaHtmlOrcamento(dados)}
                </body>
                </html>
            `;
            dispararDownloadArquivo('\uFEFF' + html, `Relatorio_Orcamentos_${obterDataHojeFormatada()}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
        }

        if (typeof showToast === 'function') {
            showToast(`Relatório de Orçamentos exportado com sucesso (${dados.length} registro(s))!`, 'success');
        }
    }

    /**
     * Exporta 2º Formato: Perdidos em XLS/XLSX
     * Colunas: Vendedor | Cliente | Valor | Nro. Orçamento | Concorrente | Comentários | Motivo
     */
    function exportarXlsPerdidos() {
        const dados = coletarDadosPerdidos();
        if (dados.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Nenhum card perdido encontrado para exportar.', 'error');
            } else {
                alert('Nenhum card perdido encontrado para exportar.');
            }
            return;
        }

        const nomeArquivo = `Relatorio_Perdidos_${obterDataHojeFormatada()}.xlsx`;
        const sucesso = exportarComSheetJS({
            incluirOrcamentos: false,
            incluirPerdidos: true,
            dadosPerdidos: dados,
            nomeArquivo: nomeArquivo
        });

        if (!sucesso) {
            const html = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Perdidos</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                </head>
                <body>
                    ${gerarTabelaHtmlPerdidos(dados)}
                </body>
                </html>
            `;
            dispararDownloadArquivo('\uFEFF' + html, `Relatorio_Perdidos_${obterDataHojeFormatada()}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
        }

        if (typeof showToast === 'function') {
            showToast(`Relatório de Perdidos exportado com sucesso (${dados.length} registro(s))!`, 'success');
        }
    }

    /**
     * Exporta Relatório Consolidado (Orçamentos + Perdidos) em 1 arquivo com 2 abas!
     */
    function exportarXlsConsolidadoOrcamentosEPerdidos() {
        const dadosOrc = coletarDadosOrcamentos();
        const dadosPerd = coletarDadosPerdidos();

        if (dadosOrc.length === 0 && dadosPerd.length === 0) {
            if (typeof showToast === 'function') {
                showToast('Nenhum dado encontrado para exportar.', 'error');
            } else {
                alert('Nenhum dado encontrado para exportar.');
            }
            return;
        }

        const nomeArquivo = `Relatorio_Orcamentos_e_Perdidos_${obterDataHojeFormatada()}.xlsx`;
        const sucesso = exportarComSheetJS({
            incluirOrcamentos: true,
            incluirPerdidos: true,
            dadosOrcamentos: dadosOrc,
            dadosPerdidos: dadosPerd,
            nomeArquivo: nomeArquivo
        });

        if (!sucesso) {
            // Em HTML XLS, combina as duas seções com títulos bem visíveis
            const html = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                </head>
                <body>
                    <h2 style="font-family: Calibri, Arial; margin-bottom: 8px;">1º Orçamentos em Aberto</h2>
                    ${gerarTabelaHtmlOrcamento(dadosOrc)}
                    <br><br>
                    <h2 style="font-family: Calibri, Arial; margin-bottom: 8px;">2º Cards Perdidos / Descartados</h2>
                    ${gerarTabelaHtmlPerdidos(dadosPerd)}
                </body>
                </html>
            `;
            dispararDownloadArquivo('\uFEFF' + html, `Relatorio_Orcamentos_e_Perdidos_${obterDataHojeFormatada()}.xls`, 'application/vnd.ms-excel;charset=utf-8;');
        }

        if (typeof showToast === 'function') {
            showToast(`Planilha XLS Consolidada gerada (${dadosOrc.length} Orçamentos e ${dadosPerd.length} Perdidos)!`, 'success');
        }
    }

    /**
     * Modal amigável para o usuário escolher o tipo de download
     */
    function abrirModalExportacaoXlsPersonalizado() {
        const modalId = 'modalExportacaoXlsOficial';
        let modalEl = document.getElementById(modalId);

        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = modalId;
            modalEl.className = 'modal-overlay';
            modalEl.style.zIndex = '99999';
            modalEl.innerHTML = `
                <div class="modal" style="max-width: 520px;">
                    <div class="modal-header">
                        <h2>📊 Exportar Relatório em XLS / Excel</h2>
                        <button class="modal-close" onclick="fecharModal('${modalId}')">✕</button>
                    </div>
                    <div style="padding: 16px 0;">
                        <p class="text-sm" style="color:var(--text-secondary); margin-bottom: 18px;">
                            Exporte os relatórios exatamente no formato de colunas, cabeçalho cinza e padronização solicitado:
                        </p>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <!-- Opção 1: Consolidada -->
                            <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; background: var(--bg-hover); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                <div>
                                    <strong style="display: block; font-size: 14px; color: var(--text-primary);">📑 Planilha Completa (2 Abas)</strong>
                                    <span style="font-size: 12px; color: var(--text-muted);">Aba 1: Orçamentos • Aba 2: Perdidos</span>
                                </div>
                                <button type="button" class="btn btn-primary btn-sm" onclick="exportarXlsConsolidadoOrcamentosEPerdidos(); fecharModal('${modalId}');">
                                    Baixar XLS
                                </button>
                            </div>

                            <!-- Opção 2: 1º Orçamentos -->
                            <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; background: var(--bg-card); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                <div>
                                    <strong style="display: block; font-size: 14px; color: var(--text-primary);">1º Apenas Orçamentos</strong>
                                    <span style="font-size: 11px; color: var(--text-muted);">Vendedor, Cliente, Valor, Nro. Orçamento, Probabilidade, Comentários</span>
                                </div>
                                <button type="button" class="btn btn-success btn-sm" onclick="exportarXlsOrcamentos(); fecharModal('${modalId}');">
                                    Baixar XLS
                                </button>
                            </div>

                            <!-- Opção 3: 2º Perdidos -->
                            <div style="border: 1px solid var(--border-color); border-radius: 8px; padding: 14px; background: var(--bg-card); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                                <div>
                                    <strong style="display: block; font-size: 14px; color: var(--text-primary);">2º Apenas Perdidos</strong>
                                    <span style="font-size: 11px; color: var(--text-muted);">Vendedor, Cliente, Valor, Nro. Orçamento, Concorrente, Comentários, Motivo</span>
                                </div>
                                <button type="button" class="btn btn-danger btn-sm" onclick="exportarXlsPerdidos(); fecharModal('${modalId}');">
                                    Baixar XLS
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="form-actions" style="margin-top: 16px;">
                        <button type="button" class="btn btn-outline" onclick="fecharModal('${modalId}')">Fechar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalEl);
        }

        if (typeof abrirModal === 'function') {
            abrirModal(modalId);
        } else {
            modalEl.classList.add('active', 'open');
            modalEl.style.display = 'flex';
        }
    }

    // Exportação para o escopo global do CRM
    window.exportarXlsOrcamentos = exportarXlsOrcamentos;
    window.exportarXlsPerdidos = exportarXlsPerdidos;
    window.exportarXlsConsolidadoOrcamentosEPerdidos = exportarXlsConsolidadoOrcamentosEPerdidos;
    window.abrirModalExportacaoXlsPersonalizado = abrirModalExportacaoXlsPersonalizado;

})();
