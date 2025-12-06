import type { IAgenda } from "./IAgenda.tsx";
import { Clock } from "lucide-react";

function AgendaCard({
  agenda,
  onClick,
}: {
  agenda: IAgenda;
  onClick?: () => void;
}) {
  return (
    <li
      id={agenda.id}
      onClick={onClick}
      className="rounded-lg p-3 bg-(--blue) border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <Clock size={16} className="text-neutral-500" />
          <span className="font-semibold text-sm text-neutral-800">
            {agenda.horario}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-800">
            {agenda.terapia}
          </p>
          <div className="flex flex-col gap-0.5 text-xs text-neutral-600">
            <span>
              <span className="font-medium">Prof:</span> {agenda.profissional}
            </span>
            {agenda.apoio && (
              <span>
                <span className="font-medium">Apoio:</span> {agenda.apoio}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default AgendaCard;
