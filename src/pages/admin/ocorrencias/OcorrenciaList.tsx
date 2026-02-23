import {
  ChevronLeft,
  Plus,
  Filter,
  Calendar,
  User,
  FileText,
  Search,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { IOcorrencia } from "./IOcorrencia";
import type { IProfissional } from "../profissionais/IProfissional";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import BottomDialog from "../../../components/BottomDialog";
import RHPlanilhaService from "../../../services/hr_spreadsheet/RHPlanilhaService";

function OcorrenciaList() {
  const navigate = useNavigate();
  const database = DatabaseService.getInstance();

  const [ocorrencias, setOcorrencias] = useState<IOcorrencia[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isTipoDialogOpen, setIsTipoDialogOpen] = useState(false);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [profissionalSearchTerm, setProfissionalSearchTerm] = useState("");
  const [exportPeriod, setExportPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("ocorrencia_filter");
    return saved
      ? JSON.parse(saved)
      : {
          type: "",
          professional_id: "",
          date_from: "",
          date_to: "",
        };
  });
  const [tempFilter, setTempFilter] = useState(filter);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const tipo_options = [
    "Falta",
    "Folga",
    "Atraso",
    "Férias",
    "Atestado",
    "Feriado",
    "Curso",
    "Clínica Faculdade",
    "Sábado",
    "Saiu da Instituição",
  ];

  useEffect(() => {
    setPage(1);

    if (!searchTerm) {
      loadOcorrencias(1, false);
      return;
    }

    const timer = setTimeout(() => {
      loadOcorrencias(1, false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filter, database]);

  useEffect(() => {
    database
      .get_profissionais("")
      .then((data) => setProfissionais(data))
      .catch((err) => console.error(err));
  }, [database]);

  const loadOcorrencias = (pageNum: number = page, append: boolean = false) => {
    if (loading) return;

    setLoading(true);

    database
      .get_ocorrencias({ ...filter, page: pageNum, limit: 15 })
      .then((result) => {
        if (append) {
          setOcorrencias((prev) => [...prev, ...result.data]);
        } else {
          setOcorrencias(result.data);
        }
        setHasMore(result.hasMore);
        setPage(pageNum);
      })
      .catch((err) => {
        console.error(err);
        mostrarNotificacao("Erro ao carregar ocorrências.", "error");
      })
      .finally(() => setLoading(false));
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadOcorrencias(page + 1, true);
    }
  };

  const filteredOcorrencias = ocorrencias.filter((ocorrencia) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      ocorrencia.type.toLowerCase().includes(searchLower) ||
      (ocorrencia.professional_nome &&
        ocorrencia.professional_nome.toLowerCase().includes(searchLower)) ||
      (ocorrencia.description &&
        ocorrencia.description.toLowerCase().includes(searchLower))
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta ocorrência?")) return;

    await database
      .delete_ocorrencia(id)
      .then(() => {
        mostrarNotificacao("Ocorrência excluída com sucesso!", "success");
        setOcorrencias(ocorrencias.filter((o) => o.id !== id));
      })
      .catch((err) => {
        console.error(err);
        mostrarNotificacao("Erro ao excluir ocorrência.", "error");
      });
  };

  return (
    <div className="flex flex-col gap-3 h-full p-4 bg-(--yellow)">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/admin")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">Ocorrências</h2>
        </div>
        <button
          onClick={() => navigate("/admin/ocorrencias/novo")}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Nova Ocorrência"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar ocorrências..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <button
          onClick={() => setIsExportDialogOpen(true)}
          className="p-2.5 rounded-lg border bg-white border-gray-300 text-neutral-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          title="Exportar"
        >
          <Download size={20} />
        </button>
        <button
          onClick={() => {
            setTempFilter(filter);
            setIsFilterOpen(true);
          }}
          className={`p-2.5 rounded-lg border transition-colors ${
            filter.type ||
            filter.professional_id ||
            filter.date_from ||
            filter.date_to
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-neutral-600 hover:bg-gray-50 hover:border-gray-400"
          }`}
          title="Filtrar"
        >
          <Filter size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-4 scrollbar-hidden">
        {filteredOcorrencias.length > 0 ? (
          <>
            {filteredOcorrencias.map((ocorrencia) => (
              <div
                key={ocorrencia.id}
                onClick={() => navigate(`/admin/ocorrencias/${ocorrencia.id}`)}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ocorrencia.type === "Falta"
                            ? "bg-red-100 text-red-700"
                            : ocorrencia.type === "Folga"
                            ? "bg-blue-100 text-blue-700"
                            : ocorrencia.type === "Atraso"
                            ? "bg-yellow-100 text-yellow-700"
                            : ocorrencia.type === "Férias"
                            ? "bg-pink-100 text-pink-700"
                            : ocorrencia.type === "Atestado"
                            ? "bg-orange-100 text-orange-700"
                            : ocorrencia.type === "Feriado"
                            ? "bg-gray-700 text-white"
                            : ocorrencia.type === "Curso"
                            ? "bg-gray-900 text-white"
                            : ocorrencia.type === "Clínica Faculdade"
                            ? "bg-blue-900 text-white"
                            : ocorrencia.type === "Sábado"
                            ? "bg-blue-300 text-white"
                            : ocorrencia.type === "Saiu da Instituição"
                            ? "bg-gray-400 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ocorrencia.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-neutral-400" />
                    <span>{ocorrencia.professional_nome || "Todos"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-neutral-400" />
                    <span>
                      {new Date(
                        ocorrencia.from + "T00:00:00"
                      ).toLocaleDateString("pt-BR")}{" "}
                      até{" "}
                      {new Date(ocorrencia.to + "T00:00:00").toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>

                  {ocorrencia.description && (
                    <div className="flex items-start gap-2">
                      <FileText size={16} className="text-neutral-400 mt-0.5" />
                      <span className="line-clamp-2">
                        {ocorrencia.description}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-neutral-500">
                  <span>
                    Criado em:{" "}
                    {new Date(ocorrencia.created_at).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(ocorrencia.id);
                    }}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="py-3 px-4 rounded-lg border border-gray-300 bg-white text-neutral-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Carregando..." : "Ver mais"}
              </button>
            )}
          </>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Carregando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhuma ocorrência encontrada.</p>
          </div>
        )}
      </div>

      <BottomDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
      >
        <>
          <div className="flex flex-col gap-4 pb-20">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Tipo
              </label>
              <div
                onClick={() => setIsTipoDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {tempFilter.type ? (
                  <span className="text-neutral-700">{tempFilter.type}</span>
                ) : (
                  <span className="text-neutral-400">Todos</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Profissional
              </label>
              <div
                onClick={() => setIsProfissionalDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {tempFilter.professional_id ? (
                  <span className="text-neutral-700">
                    {profissionais.find(
                      (p) => p.id === tempFilter.professional_id
                    )?.nome || "Todos"}
                  </span>
                ) : (
                  <span className="text-neutral-400">Todos</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Data Inicial (De)
              </label>
              <input
                type="date"
                value={tempFilter.date_from}
                onChange={(e) =>
                  setTempFilter({ ...tempFilter, date_from: e.target.value })
                }
                className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Data Final (Até)
              </label>
              <input
                type="date"
                value={tempFilter.date_to}
                onChange={(e) =>
                  setTempFilter({ ...tempFilter, date_to: e.target.value })
                }
                className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-4 bg-white border-t border-gray-200">
            <button
              onClick={() => {
                const defaultFilter = {
                  type: "",
                  professional_id: "",
                  date_from: "",
                  date_to: "",
                };
                setTempFilter(defaultFilter);
                setFilter(defaultFilter);
                localStorage.setItem(
                  "ocorrencia_filter",
                  JSON.stringify(defaultFilter)
                );
                setIsFilterOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-gray-200 text-neutral-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => {
                setFilter(tempFilter);
                localStorage.setItem(
                  "ocorrencia_filter",
                  JSON.stringify(tempFilter)
                );
                setIsFilterOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </>
      </BottomDialog>

      <BottomDialog
        isOpen={isTipoDialogOpen}
        onClose={() => setIsTipoDialogOpen(false)}
        title="Selecionar Tipo"
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setTempFilter({ ...tempFilter, type: "" });
              setIsTipoDialogOpen(false);
            }}
            className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
              tempFilter.type === ""
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            Todos
          </button>
          {tipo_options.map((tipo) => (
            <button
              key={tipo}
              onClick={() => {
                setTempFilter({ ...tempFilter, type: tipo });
                setIsTipoDialogOpen(false);
              }}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg border font-medium transition-colors ${
                tempFilter.type === tipo
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded ${
                  tipo === "Falta"
                    ? "bg-red-500"
                    : tipo === "Folga"
                    ? "bg-blue-500"
                    : tipo === "Atraso"
                    ? "bg-yellow-500"
                    : tipo === "Férias"
                    ? "bg-pink-500"
                    : tipo === "Atestado"
                    ? "bg-orange-500"
                    : tipo === "Feriado"
                    ? "bg-gray-700"
                    : tipo === "Curso"
                    ? "bg-black"
                    : tipo === "Clínica Faculdade"
                    ? "bg-blue-900"
                    : tipo === "Sábado"
                    ? "bg-blue-300"
                    : tipo === "Saiu da Instituição"
                    ? "bg-gray-400"
                    : "bg-gray-100"
                }`}
              ></div>
              <span className="text-neutral-700">{tipo}</span>
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isProfissionalDialogOpen}
        onClose={() => setIsProfissionalDialogOpen(false)}
        title="Selecionar Profissional"
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={profissionalSearchTerm}
              onChange={(e) => setProfissionalSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setTempFilter({ ...tempFilter, professional_id: "" });
                setIsProfissionalDialogOpen(false);
              }}
              className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                tempFilter.professional_id === ""
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {profissionais
              .filter((p) =>
                p.nome
                  .toLowerCase()
                  .includes(profissionalSearchTerm.toLowerCase())
              )
              .map((profissional) => (
                <button
                  key={profissional.id}
                  onClick={() => {
                    setTempFilter({
                      ...tempFilter,
                      professional_id: profissional.id,
                    });
                    setIsProfissionalDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    tempFilter.professional_id === profissional.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  {profissional.nome}
                </button>
              ))}
          </div>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        title="Exportar Planilha"
      >
        <div className="flex flex-col gap-4 pb-20">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Período (Mês/Ano)
            </label>
            <input
              type="month"
              value={exportPeriod}
              onChange={(e) => setExportPeriod(e.target.value)}
              className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white text-neutral-700"
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => setIsExportDialogOpen(false)}
            className="flex-1 py-3 rounded-lg bg-gray-200 text-neutral-700 font-medium hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const [ano, mes] = exportPeriod.split("-").map(Number);
              RHPlanilhaService.gerarPlanilhaOcorrencias({ mes, ano });
              setIsExportDialogOpen(false);
            }}
            className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Baixar Planilha
          </button>
        </div>
      </BottomDialog>
    </div>
  );
}

export default OcorrenciaList;
