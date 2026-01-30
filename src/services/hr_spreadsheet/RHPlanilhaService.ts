import { mostrarNotificacao } from "../../util/notificacao";
import ExcelJS from "exceljs";
import type { IOcorrencia } from "../../pages/admin/ocorrencias/IOcorrencia";
import DatabaseService from "../database/DatabaseService";

interface ProfissionalOcorrencias {
  id: string;
  nome: string;
  ocorrencias: Map<string, IOcorrencia[]>;
}

export default class RHPlanilhaService {
  private static readonly TIPO_COLORS: { [key: string]: string } = {
    Falta: "FFFF0000", // Vermelho
    Folga: "FF0000FF", // Azul
    Atraso: "FFFFFF00", // Amarelo
    Férias: "FFFFC0CB", // Rosa
    Atestado: "FFFFA500", // Laranja
    Feriado: "FF444444", // Cinza escuro
    Curso: "FF000000", // Preto
    "Clínica Faculdade": "FF00008B", // Azul escuro
    Sábado: "FFADD8E6", // Azul claro
    "Saiu da Instituição": "FF808080", // Cinza
  };

  private static readonly TIPO_PRESENTE = "FFFFFFFF"; // Branco (sem cor)
  private static readonly COR_PRESENTE = "FF90EE90"; // Verde claro
  private static readonly COR_FIM_DE_SEMANA = "FF800020"; // Vinho/Burgundy

  static async gerarPlanilhaOcorrencias(mesAno?: { mes: number; ano: number }) {
    try {
      const database = DatabaseService.getInstance();

      // Define o período: mês atual ou especificado
      const now = new Date();
      const mes = mesAno?.mes ?? now.getMonth() + 1;
      const ano = mesAno?.ano ?? now.getFullYear();

      // Primeiro e último dia do mês
      const primeiraData = new Date(ano, mes - 1, 1);
      const ultimaData = new Date(ano, mes, 0);
      const diasNoMes = ultimaData.getDate();

      mostrarNotificacao("Gerando planilha...", "info");

      const turno = localStorage.getItem("app_turno");

      // Buscar todos os profissionais
      const profissionais = await database.get_profissionais("", { status: "", shift: turno ?? "", function: "" });

      // Buscar todas as ocorrências do mês
      const dateFrom = primeiraData.toISOString().split("T")[0];
      const dateTo = ultimaData.toISOString().split("T")[0];

      // Buscar todas as ocorrências sem paginação
      const result = await database.get_ocorrencias({
        type: "",
        professional_id: "",
        date_from: dateFrom,
        date_to: dateTo,
        page: 1,
        limit: 10000, // Limite alto para pegar todas
      });

      // Organizar ocorrências por profissional e dia
      const profissionaisData: Map<string, ProfissionalOcorrencias> = new Map();

      profissionais.forEach((prof) => {
        profissionaisData.set(prof.id, {
          id: prof.id,
          nome: prof.nome,
          ocorrencias: new Map(),
        });
      });

      result.data.forEach((ocorrencia) => {
        // Se não tem professional_id, aplica para todos (ex: Feriado)
        if (!ocorrencia.professional_id) {
          // Expandir ocorrência para todos os dias do período
          const from = new Date(ocorrencia.from);
          const to = new Date(ocorrencia.to);

          // eslint-disable-next-line prefer-const
          let currentDate = new Date(from);

          while (currentDate <= to) {
            const dataKey = currentDate.toISOString().split("T")[0];

            // Aplicar para todos os profissionais
            profissionaisData.forEach((profData) => {
              if (!profData.ocorrencias.has(dataKey)) {
                profData.ocorrencias.set(dataKey, []);
              }
              profData.ocorrencias.get(dataKey)!.push(ocorrencia);
            });

            currentDate.setDate(currentDate.getDate() + 1);
          }
        } else {
          // Ocorrência específica de um profissional
          const profData = profissionaisData.get(ocorrencia.professional_id);
          if (!profData) return;

          // Expandir ocorrência para todos os dias do período
          const from = new Date(ocorrencia.from);
          const to = new Date(ocorrencia.to);

          // eslint-disable-next-line prefer-const
          let currentDate = new Date(from);

          while (currentDate <= to) {
            const dataKey = currentDate.toISOString().split("T")[0];

            if (!profData.ocorrencias.has(dataKey)) {
              profData.ocorrencias.set(dataKey, []);
            }
            profData.ocorrencias.get(dataKey)!.push(ocorrencia);

            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });

      // Criar planilha
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Ocorrências");

      // Adicionar legenda primeiro (2 linhas separadas)
      const legendaItens = [
        { tipo: "DE FALTA", cor: this.TIPO_COLORS["Falta"] },
        { tipo: "DE PRESENTE", cor: this.COR_PRESENTE },
        { tipo: "DE ATESTADO", cor: this.TIPO_COLORS["Atestado"] },
        {
          tipo: "SAIU DA INSTITITUÇAO",
          cor: this.TIPO_COLORS["Saiu da Instituição"],
        },
        { tipo: "DE CURSO", cor: this.TIPO_COLORS["Curso"] },
      ];

      const legendaItens2 = [
        { tipo: "DE FOLGA", cor: this.TIPO_COLORS["Folga"] },
        { tipo: "DE ATRASAO", cor: this.TIPO_COLORS["Atraso"] },
        { tipo: "DE FÉRIAS", cor: this.TIPO_COLORS["Férias"] },
        { tipo: "FERIADO", cor: this.TIPO_COLORS["Feriado"] },
        { tipo: "CLÍNICA FACUL", cor: this.TIPO_COLORS["Clínica Faculdade"] },
        { tipo: "DE SÁBADO", cor: this.TIPO_COLORS["Sábado"] },
      ];

      // Primeira linha de legenda (inicia na coluna B = 2)
      worksheet.addRow([]);
      worksheet.addRow([]);

      // Estilizar primeira linha de legenda
      const row1 = worksheet.getRow(1);
      row1.height = 15;
      let colIndex = 2; // Começa na coluna B
      legendaItens.forEach((item) => {
        const cellCor = row1.getCell(colIndex);
        cellCor.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: item.cor },
        };
        cellCor.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Mesclar 5 células para o texto
        const startCol = colIndex + 1;
        const endCol = colIndex + 5;
        worksheet.mergeCells(1, startCol, 1, endCol);

        const cellTexto = row1.getCell(startCol);
        cellTexto.value = item.tipo;
        cellTexto.font = { size: 8, bold: true };
        cellTexto.alignment = { vertical: "middle", horizontal: "left" };

        colIndex += 6; // 1 coluna de cor + 5 colunas mescladas
      });

      // Estilizar segunda linha de legenda
      const row2 = worksheet.getRow(2);
      row2.height = 15;
      colIndex = 2; // Começa na coluna B
      legendaItens2.forEach((item) => {
        const cellCor = row2.getCell(colIndex);
        cellCor.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: item.cor },
        };
        cellCor.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Mesclar 5 células para o texto
        const startCol = colIndex + 1;
        const endCol = colIndex + 5;
        worksheet.mergeCells(2, startCol, 2, endCol);

        const cellTexto = row2.getCell(startCol);
        cellTexto.value = item.tipo;
        cellTexto.font = { size: 8, bold: true };
        cellTexto.alignment = { vertical: "middle", horizontal: "left" };

        colIndex += 6; // 1 coluna de cor + 5 colunas mescladas
      });

      // Adicionar linha do cabeçalho (agora linha 3, sem linha em branco)
      const headerCells = ["PROFISSIONAIS"];
      for (let dia = 1; dia <= diasNoMes; dia++) {
        headerCells.push(dia.toString());
      }
      worksheet.addRow(headerCells);

      // Configurar larguras das colunas
      // Coluna A: 300px (aproximadamente 40 caracteres no Excel)
      worksheet.getColumn(1).width = 40;

      // Todas as outras colunas: 25px (aproximadamente 3.43 caracteres no Excel)
      for (let col = 2; col <= diasNoMes + 1; col++) {
        worksheet.getColumn(col).width = 3.43;
      }

      // Estilizar cabeçalho (linha 3)
      const headerRow = worksheet.getRow(3);
      headerRow.height = 20;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD3D3D3" },
        };
        cell.font = { bold: true, size: 11 };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Adicionar dados dos profissionais
      const profissionaisOrdenados = Array.from(
        profissionaisData.values()
      ).sort((a, b) => a.nome.localeCompare(b.nome));

      profissionaisOrdenados.forEach((profData) => {
        // Verificar se o profissional está inativo e não tem ocorrências específicas
        const profissional = profissionais.find((p) => p.id === profData.id);

        // Verificar se tem alguma ocorrência específica do profissional (não geral)
        let temOcorrenciasEspecificas = false;
        profData.ocorrencias.forEach((ocorrenciasDia) => {
          if (ocorrenciasDia.some((oc) => oc.professional_id === profData.id)) {
            temOcorrenciasEspecificas = true;
          }
        });

        if (
          (profissional?.status === "INATIVO" ||
            profissional?.funcao === "Coordenador - ABA") &&
          !temOcorrenciasEspecificas
        ) {
          // Pular profissional inativo sem ocorrências específicas
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rowData: any[] = [profData.nome];

        for (let dia = 1; dia <= diasNoMes; dia++) {
          rowData.push("");
        }

        const row = worksheet.addRow(rowData);
        row.height = 20;

        // Estilizar célula do nome
        const nomeCell = row.getCell(1);
        nomeCell.alignment = { vertical: "middle", horizontal: "left" };
        nomeCell.font = { size: 10 };
        nomeCell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Colorir células dos dias
        for (let dia = 1; dia <= diasNoMes; dia++) {
          const data = new Date(ano, mes - 1, dia);
          const dataKey = data.toISOString().split("T")[0];
          const ocorrenciasDia = profData.ocorrencias.get(dataKey) || [];
          const diaSemana = data.getDay(); // 0 = Domingo, 6 = Sábado

          // Verificar se é dia passado
          const hoje = new Date();
          hoje.setHours(0, 0, 0, 0);
          const isDiaPassado = data < hoje;

          const cell = row.getCell(dia + 1);
          cell.alignment = { vertical: "middle", horizontal: "center" };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          // Verificar se é fim de semana (sábado ou domingo)
          if (ocorrenciasDia.length > 0) {
            // Tem ocorrência - usar a cor da ocorrência
            const tipo = ocorrenciasDia[0].type;
            const cor = this.TIPO_COLORS[tipo] || this.TIPO_PRESENTE;

            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: cor },
            };
          } else if (diaSemana === 0 || diaSemana === 6) {
            // Fim de semana sem ocorrência - cor vinho
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: this.COR_FIM_DE_SEMANA },
            };
          } else if (!isDiaPassado) {
            // Dia futuro sem ocorrência - branco
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: this.TIPO_PRESENTE },
            };
          } else {
            // Dia passado ou hoje sem ocorrência - verde (presente)
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: this.COR_PRESENTE },
            };
          }
        }
      });

      // Gerar arquivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ocorrencias_${mes.toString().padStart(2, "0")}_${ano}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      mostrarNotificacao("Planilha gerada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar planilha:", error);
      mostrarNotificacao("Erro ao gerar planilha.", "error");
    }
  }
}
