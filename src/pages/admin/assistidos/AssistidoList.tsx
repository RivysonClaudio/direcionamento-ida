import { ChevronLeft, Search, UserPlus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssistidoCard from "./AssistidoCard";
import type { IAssistido } from "./IAssistido";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import { useEffect, useState } from "react";
import BottomDialog from "../../../components/BottomDialog";
import { mostrarNotificacao } from "../../../util/notificacao.ts";

function AssistidoList() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("assistido_filter");
    return saved
      ? JSON.parse(saved)
      : {
          status: "ATIVO",
          shift: "",
          support: "",
        };
  });
  const [tempFilter, setTempFilter] = useState({
    status: "ATIVO",
    shift: "",
    support: "",
  });

  const loadAssistidos = async (search: string) => {
    try {
      const data = await database.get_assistidos(search, filter);
      setAssistidos(data);
    } catch (err) {
      mostrarNotificacao(
        "Erro ao carregar assistidos. Tente novamente: " +
          (err as Error).message,
        "error"
      );
    }
  };

  useEffect(() => {
    loadAssistidos("");
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAssistidos(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">Assistidos</h2>
          <p className="text-sm text-neutral-600">
            {assistidos.length} cadastrados
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/assistidos/novo")}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-green-600 transition-colors"
          title="Novo Assistido"
        >
          <UserPlus size={24} />
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadAssistidos(searchTerm);
              }
            }}
          />
        </div>
        <button
          onClick={() => {
            setTempFilter(filter);
            setIsFilterOpen(true);
          }}
          className={`p-2.5 rounded-lg border transition-colors ${
            filter.status !== "ATIVO" || filter.shift || filter.support
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-neutral-600 hover:text-neutral-800 hover:border-gray-400"
          }`}
          title="Filtrar"
        >
          <Filter size={20} />
        </button>
      </div>

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm">
        {assistidos && assistidos.length > 0 ? (
          assistidos.map((assistido, index) => (
            <AssistidoCard
              key={index}
              assistido={assistido}
              onClick={() => navigate(`${assistido.id}`)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhum assistido encontrado.</p>
          </div>
        )}
      </ul>

      <BottomDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtros"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTempFilter({ ...tempFilter, status: "" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.status === ""
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() =>
                  setTempFilter({ ...tempFilter, status: "ATIVO" })
                }
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.status === "ATIVO"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Ativo
              </button>
              <button
                onClick={() =>
                  setTempFilter({ ...tempFilter, status: "INATIVO" })
                }
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.status === "INATIVO"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Inativo
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Turno
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTempFilter({ ...tempFilter, shift: "" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.shift === ""
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTempFilter({ ...tempFilter, shift: "MANHÃ" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.shift === "MANHÃ"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Manhã
              </button>
              <button
                onClick={() => setTempFilter({ ...tempFilter, shift: "TARDE" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.shift === "TARDE"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tarde
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Nível de Suporte
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTempFilter({ ...tempFilter, support: "" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.support === ""
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTempFilter({ ...tempFilter, support: "I" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.support === "I"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                I
              </button>
              <button
                onClick={() => setTempFilter({ ...tempFilter, support: "II" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.support === "II"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                II
              </button>
              <button
                onClick={() => setTempFilter({ ...tempFilter, support: "III" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.support === "III"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                III
              </button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                const defaultFilter = {
                  status: "ATIVO",
                  shift: "",
                  support: "",
                };
                setTempFilter(defaultFilter);
                setFilter(defaultFilter);
                localStorage.setItem(
                  "assistido_filter",
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
                  "assistido_filter",
                  JSON.stringify(tempFilter)
                );
                setIsFilterOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AssistidoList;
