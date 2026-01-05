import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import DatabaseService from "../../../services/database/DatabaseService";

function AgendaMedSyncCard() {
  const navigate = useNavigate();
  const [syncData, setSyncData] = useState<
    Array<{
      created_at: string | null;
      agenda_med_sync: "sync" | "only_in_med" | "only_in_app";
      total: number;
    }>
  >([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = DatabaseService.getInstance();
    database
      .get_agenda_med_sync_count()
      .then((data) => {
        setSyncData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const total = syncData.reduce((acc, item) => acc + item.total, 0);
  const itemSync = syncData.find((item) => item.agenda_med_sync === "sync");
  const sincronizadas = itemSync?.total || 0;
  const itemApenasNoMed = syncData.find(
    (item) => item.agenda_med_sync === "only_in_med"
  );
  const apenasNoMed = itemApenasNoMed?.total || 0;
  const dataAtualizacaoMed = itemSync?.created_at
    ? new Date(itemSync.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const apenasNoApp =
    syncData.find((item) => item.agenda_med_sync === "only_in_app")?.total || 0;
  const percentualSincronizado =
    total > 0 ? Math.round((sincronizadas / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg flex items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-neutral-800">
          Sincronização MedTherapy
        </h3>
        {isOpen ? (
          <ChevronUp size={18} className="text-neutral-600" />
        ) : (
          <ChevronDown size={18} className="text-neutral-600" />
        )}
      </button>
      {isOpen && (
        <div
          onClick={() => navigate("/admin/medtherapy")}
          className="px-3 pb-3 flex flex-col gap-3"
        >
          {loading ? (
            <div className="text-center py-4 text-sm text-neutral-500">
              Carregando...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <CheckCircle
                    size={18}
                    className="text-green-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-green-900 leading-tight">
                      Sincronizadas
                    </p>
                    <p className="text-xl font-bold text-green-700">
                      {sincronizadas}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <AlertCircle
                    size={18}
                    className="text-orange-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-orange-900 leading-tight">
                      Entrou no Med
                    </p>
                    <p className="text-xl font-bold text-orange-700">
                      {apenasNoMed}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <XCircle size={18} className="text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-blue-900 leading-tight">
                      Saiu do Med
                    </p>
                    <p className="text-xl font-bold text-blue-700">
                      {apenasNoApp}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-600">
                      Total de Agendas
                    </span>
                    <span className="text-sm font-bold text-neutral-800">
                      {total}
                    </span>
                  </div>
                  {dataAtualizacaoMed && (
                    <span className="text-xs text-neutral-500">
                      Atualizado em: {dataAtualizacaoMed}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${percentualSincronizado}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 min-w-[40px] text-right">
                    {percentualSincronizado}%
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AgendaMedSyncCard;
