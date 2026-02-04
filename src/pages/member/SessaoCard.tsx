import type { ISessao } from "../admin/sessoes/ISessao";

interface SessaoCardProps {
  sessao: ISessao;
  onClick?: () => void;
}

function SessaoCard({ sessao, onClick }: SessaoCardProps) {
  const isExtra = sessao.terapia.includes("(Extra)");

  const getBgColor = () => {
    if (isExtra) {
      return "bg-purple-100 border-purple-200";
    }
    return "bg-blue-50 border-blue-200";
  };

  return (
    <li
      onClick={onClick}
      className={`p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getBgColor()}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-neutral-800">
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

        <div className="border-t border-gray-200"></div>

        <div className="flex items-center justify-between text-xs text-neutral-600">
          {sessao.sala === 0 ? (
            <span>Em Ambiente Externo</span>
          ) : sessao.sala ? (
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
