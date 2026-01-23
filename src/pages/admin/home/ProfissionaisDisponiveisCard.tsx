import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DatabaseService from "../../../services/database/DatabaseService";
import Util from "../../../util/util";

function ProfissionaisDisponiveisCard() {
  const [profissionaisLivres, setProfissionaisLivres] = useState<
    Record<string, Array<{ id: string; name: string }>>
  >({});
  const turno = localStorage.getItem("app_turno") === "MANHA" ? "MANHÃ" : "TARDE";
  const [horarioExpandido, setHorarioExpandido] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const database = DatabaseService.getInstance();
    database
      .get_profissionais_disponiveis_by_date(Util.iso_date(0))
      .then((data) => setProfissionaisLivres(data));
  }, []);

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg flex items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-neutral-800">
          Profissionais Disponíveis - Hoje
        </h3>
        {isOpen ? (
          <ChevronUp size={18} className="text-neutral-600" />
        ) : (
          <ChevronDown size={18} className="text-neutral-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          <div className="overflow-x-auto">
            <div className="flex flex-col gap-3">
              {(turno === "MANHÃ"
                ? [
                    "07:15",
                    "08:00",
                    "08:45",
                    "09:30",
                    "10:15",
                    "11:00",
                    "11:45",
                  ]
                : [
                    "13:15",
                    "14:00",
                    "14:45",
                    "15:30",
                    "16:15",
                    "17:00",
                    "17:45",
                  ]
              ).map((horario) => {
                const profissionais = profissionaisLivres[horario] || [];
                const isExpandido = horarioExpandido === horario;
                return (
                  <button
                    key={horario}
                    onClick={() =>
                      setHorarioExpandido(isExpandido ? null : horario)
                    }
                    className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-700">
                        {horario}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {profissionais.length} disponíve
                        {profissionais.length !== 1 ? "is" : "l"}
                      </span>
                    </div>
                    {isExpandido && profissionais.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {profissionais.map((prof) => (
                          <li
                            key={prof.id}
                            className="text-sm text-neutral-700 py-1 px-2 hover:bg-blue-50 rounded transition-colors"
                          >
                            {prof.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfissionaisDisponiveisCard;
