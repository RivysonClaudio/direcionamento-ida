import { ChevronLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IMedAgenda } from "./IMedAgenda";
import DatabaseService from "../../../services/database/DatabaseService";
import { useEffect, useState } from "react";
import MedAgendaCard from "./MedAgendaCard";
import BottomDialog from "../../../components/BottomDialog";

function MedAgenda() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [agendas, setAgendas] = useState<IMedAgenda[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "sync" | "only_in_app" | "only_in_med"
  >(() => {
    const saved = localStorage.getItem("medagenda_filter_status");
    return (saved as "all" | "sync" | "only_in_app" | "only_in_med") || "all";
  });
  const [tempFilter, setTempFilter] = useState<
    "all" | "sync" | "only_in_app" | "only_in_med"
  >("all");
  const [shift, setShift] = useState<"all" | "morning" | "afternoon">(() => {
    const saved = localStorage.getItem("medagenda_filter_shift");
    return (saved as "all" | "morning" | "afternoon") || "all";
  });
  const [tempShift, setTempShift] = useState<"all" | "morning" | "afternoon">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPage(1);
    localStorage.setItem("medagenda_filter_status", filter);
    localStorage.setItem("medagenda_filter_shift", shift);

    if (!searchTerm) {
      loadAgendas(1, false);
      return;
    }

    const timer = setTimeout(() => {
      loadAgendas(1, false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filter, shift]);

  const loadAgendas = (pageNum: number = page, append: boolean = false) => {
    if (loading) return;

    setLoading(true);

    database
      .get_medtherapy_agenda(searchTerm, filter, shift, pageNum)
      .then((result) => {
        if (append) {
          setAgendas((prev) => [...prev, ...result.data]);
        } else {
          setAgendas(result.data);
        }
        setTotal(result.total);
        setHasMore(result.hasMore);
        setPage(pageNum);
      })
      .catch((err) => console.error("Error loading agendas:", err))
      .finally(() => setLoading(false));
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadAgendas(page + 1, true);
    }
  };

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
          <h2 className="text-xl font-bold text-neutral-800">
            Sincronização Med
          </h2>
          <p className="text-sm text-neutral-600">{total} agendas</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setTempFilter(filter);
            setTempShift(shift);
            setIsFilterOpen(true);
          }}
          className={`p-2.5 rounded-lg border transition-colors ${
            filter !== "all" || shift !== "all"
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-neutral-600 hover:text-neutral-800 hover:border-gray-400"
          }`}
          title="Filtrar"
        >
          <Filter size={20} />
        </button>
      </div>

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm">
        {agendas && agendas.length > 0 ? (
          <>
            {agendas.map((agenda, index) => (
              <MedAgendaCard
                key={index}
                agenda={agenda}
                onUpdate={() => loadAgendas(1)}
              />
            ))}
            {hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="py-3 px-4 rounded-lg border border-gray-300 text-neutral-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-center">Nenhuma agenda encontrada.</p>
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
              Status de Sincronização
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTempFilter("all")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter === "all"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTempFilter("sync")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter === "sync"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Sincronizados
              </button>
              <button
                onClick={() => setTempFilter("only_in_app")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter === "only_in_app"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Só no APP
              </button>
              <button
                onClick={() => setTempFilter("only_in_med")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempFilter === "only_in_med"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Só no MED
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700">
              Turno
            </label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setTempShift("all")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempShift === "all"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTempShift("morning")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempShift === "morning"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Manhã
              </button>
              <button
                onClick={() => setTempShift("afternoon")}
                className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                  tempShift === "afternoon"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                Tarde
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setTempFilter("all");
                setFilter("all");
                setTempShift("all");
                setShift("all");
                setIsFilterOpen(false);
              }}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-neutral-700 hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => {
                setFilter(tempFilter);
                setShift(tempShift);
                setIsFilterOpen(false);
              }}
              className="flex-1 py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </BottomDialog>
    </div>
  );
}

export default MedAgenda;
