import { ChevronLeft, Search, UserPlus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import type { IProfissional } from "./IProfissional.tsx";
import BottomDialog from "../../../components/BottomDialog";
import ProfissionalCard from "./ProfissionalCard";
import { mostrarNotificacao } from "../../../util/notificacao.ts";

function ProfissionalList() {
  const navigate = useNavigate();
  const database = DatabaseService.getInstance();
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("profissional_filter");
    return saved
      ? JSON.parse(saved)
      : {
          status: "",
          shift: "",
          function: "",
        };
  });
  const [tempFilter, setTempFilter] = useState({
    status: "",
    shift: "",
    function: "",
  });
  const [isFunctionDialogOpen, setIsFunctionDialogOpen] = useState(false);

  const function_options = [
    "Todas",
    "Aplicador - ABA",
    "Aux. Coord. - ABA",
    "Coordenador - ABA",
  ];

  const loadProfissionais = async (search: string) => {
    try {
      const data = await database.get_profissionais(search, filter);
      setProfissionais(data);
    } catch (err) {
      mostrarNotificacao(
        "Erro ao carregar profissionais. Tente novamente: " +
          (err as Error).message,
        "error"
      );
      console.error(err);
    }
  };

  useEffect(() => {
    localStorage.setItem("profissional_filter", JSON.stringify(filter));

    if (!searchTerm) {
      loadProfissionais("");
      return;
    }

    const timer = setTimeout(() => {
      loadProfissionais(searchTerm);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filter]);

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
          <h2 className="text-xl font-bold text-neutral-800">Profissionais</h2>
          <p className="text-sm text-neutral-600">
            {profissionais.length} cadastrados
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/profissionais/novo")}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-green-600 transition-colors"
          title="Novo Profissional"
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
                loadProfissionais(searchTerm);
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
            filter.status !== "" ||
            filter.shift !== "" ||
            filter.function !== ""
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-neutral-600 hover:text-neutral-800 hover:border-gray-400"
          }`}
          title="Filtrar"
        >
          <Filter size={20} />
        </button>
      </div>

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm scrollbar-hidden">
        {profissionais && profissionais.length > 0 ? (
          profissionais.map((profissional, index) => (
            <ProfissionalCard
              key={index}
              profissional={profissional}
              onClick={() => navigate(`${profissional.id}`)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhum profissional encontrado.</p>
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
              Funções
            </label>
            <button
              type="button"
              onClick={() => setIsFunctionDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {tempFilter.function || "Todas"}
            </button>
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
                onClick={() => setTempFilter({ ...tempFilter, shift: "MANHA" })}
                className={`flex-1 py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter.shift === "MANHA"
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

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => {
                const defaultFilter = {
                  status: "",
                  shift: "",
                  function: "",
                };
                setTempFilter(defaultFilter);
                setFilter(defaultFilter);
                setIsFilterOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-gray-200 text-neutral-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => {
                setFilter(tempFilter);
                setIsFilterOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isFunctionDialogOpen}
        onClose={() => setIsFunctionDialogOpen(false)}
        title="Selecione a Função"
      >
        <div className="flex flex-col gap-2">
          {function_options.map((funcao) => (
            <button
              key={funcao}
              onClick={() => {
                setTempFilter({
                  ...tempFilter,
                  function: funcao === "Todas" ? "" : funcao,
                });
                setIsFunctionDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                (tempFilter.function === "" && funcao === "Todas") ||
                tempFilter.function === funcao
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
              }`}
            >
              {funcao}
            </button>
          ))}
        </div>
      </BottomDialog>
    </div>
  );
}

export default ProfissionalList;
