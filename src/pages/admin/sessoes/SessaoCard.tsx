import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ISessao } from "./ISessao";

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
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1 min-w-[50px]">
          <Clock size={16} className="text-neutral-500" />
          <span className="font-semibold text-sm text-neutral-800">
            {sessao.horario}
          </span>
          <div className={`w-2 h-2 rounded-full ${getStatusDot()}`}></div>
        </div>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-800">
            {sessao.assistido_nome}
          </p>
          <p className="text-xs text-neutral-600">{sessao.terapia}</p>
          {(sessao.profissional_nome || sessao.apoio_nome) && (
            <div className="flex flex-col gap-0.5 text-xs text-neutral-500">
              {sessao.profissional_nome && (
                <span>
                  <span className="font-medium">Prof:</span>{" "}
                  {sessao.profissional_nome}
                </span>
              )}
              {sessao.apoio_nome && (
                <span>
                  <span className="font-medium">Apoio:</span>{" "}
                  {sessao.apoio_nome}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default SessaoCard;
