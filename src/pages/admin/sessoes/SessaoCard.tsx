import type { ISessao } from "./ISessao";
import { useNavigate } from "react-router-dom";

interface SessaoCardProps {
  sessao: ISessao;
}

function SessaoCard({ sessao }: SessaoCardProps) {
  const navigate = useNavigate();
  const getStatusColor = () => {
    switch (sessao.status) {
      case "PENDENTE":
        return "bg-red-50 border-red-200";
      case "AGENDADO":
        return "bg-(--blue) border-blue-200";
      case "CANCELADO":
        return "bg-gray-50 border-gray-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getStatusDot = () => {
    switch (sessao.status) {
      case "PENDENTE":
        return "bg-red-500";
      case "AGENDADO":
        return "bg-green-500";
      case "CANCELADO":
        return "bg-gray-400";
    }
  };

  return (
    <li
      onClick={() => navigate(`/admin/sessoes/${sessao.id}`)}
      className={`rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getStatusColor()}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">
              {sessao.assistido_nome}
            </p>
            <p className="text-xs text-neutral-600">{sessao.terapia}</p>
            {sessao.profissional_nome && (
              <span className="text-xs text-neutral-600">
                <span className="font-semibold">P:</span>{" "}
                {sessao.profissional_nome}
              </span>
            )}
            {sessao.apoio_nome && (
              <span className="text-xs text-neutral-600">
                <span className="font-semibold">A:</span> {sessao.apoio_nome}
              </span>
            )}
          </div>
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${getStatusDot()}`}
          ></div>
        </div>

        <div className="border-t border-gray-200"></div>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          {sessao.sala ? (
            <span>Sala {sessao.sala}</span>
          ) : (
            <span>Sem Sala</span>
          )}
          <span>{sessao.horario}</span>
        </div>
      </div>
    </li>
  );
}

export default SessaoCard;
