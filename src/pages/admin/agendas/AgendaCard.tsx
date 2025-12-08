import type { IAgenda } from "./IAgenda.tsx";
import { Clock } from "lucide-react";
import { useRef } from "react";

function AgendaCard({
  agenda,
  onClick,
  onLongPress,
}: {
  agenda: IAgenda;
  onClick?: () => void;
  onLongPress?: () => void;
}) {
  const pressTimer = useRef<number | null>(null);
  const longPressTriggered = useRef(false);

  const handlePressStart = () => {
    longPressTriggered.current = false;
    pressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      if (onLongPress) onLongPress();
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (!longPressTriggered.current && onClick) onClick();
  };
  return (
    <li
      id={agenda.id}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      className="rounded-lg p-3 bg-(--blue) border border-blue-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer select-none"
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
