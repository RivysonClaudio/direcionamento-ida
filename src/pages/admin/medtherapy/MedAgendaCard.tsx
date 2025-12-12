import type { IMedAgenda } from "./IMedAgenda";

interface MedAgendaCardProps {
  agenda: IMedAgenda;
}

function MedAgendaCard({ agenda }: MedAgendaCardProps) {
  const diasDaSemana: Record<number, string> = {
    2: "Segunda",
    3: "Terça",
    4: "Quarta",
    5: "Quinta",
    6: "Sexta",
  };

  return (
    <li className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-neutral-800">
          {agenda.patient_name}
        </h3>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <span>{diasDaSemana[agenda.week_day]}</span>
            <span>•</span>
            <span>{agenda.session_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                agenda.agenda_med_sync
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {agenda.agenda_med_sync ? "Sincronizado" : "Pendente"}
            </span>
            {!agenda.schedule_id && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700">
                Sem agenda IDA
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-neutral-500">{agenda.med_description}</p>
      </div>
    </li>
  );
}

export default MedAgendaCard;
