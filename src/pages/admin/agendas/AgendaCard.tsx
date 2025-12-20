import type { IAgenda } from "./IAgenda.tsx";
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
      className="rounded-lg p-2.5 bg-(--blue) border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer select-none"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium text-neutral-800">
            {agenda.terapia}
          </p>
          <span className="text-xs text-neutral-600">
            <span className="font-semibold">P:</span> {agenda.profissional}
          </span>
          {agenda.apoio && (
            <span className="text-xs text-neutral-600">
              <span className="font-semibold">A:</span> {agenda.apoio}
            </span>
          )}
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          {agenda.sala ? (
            <span>Sala {agenda.sala}</span>
          ) : (
            <span>Sem Sala</span>
          )}
          {agenda.horario ? (
            <span>{agenda.horario}</span>
          ) : (
            <span>Sem Horário</span>
          )}
        </div>
      </div>
    </li>
  );
}

export default AgendaCard;
