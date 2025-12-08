import type { ISessao } from "../admin/sessoes/ISessao";

interface SessaoCardProps {
  sessao: ISessao;
  onClick?: () => void;
}

function SessaoCard({ sessao, onClick }: SessaoCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 bg-white rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:border-gray-400 hover:shadow-md transition-all"
    >
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-neutral-800">
          {sessao.terapia}
        </p>
        <p className="text-xs text-neutral-600">
          Assistido: {sessao.assistido_nome}
        </p>
        {sessao.profissional_nome && (
          <p className="text-xs text-neutral-600">
            Profissional: {sessao.profissional_nome}
          </p>
        )}
        {sessao.apoio_nome && (
          <p className="text-xs text-neutral-600">Apoio: {sessao.apoio_nome}</p>
        )}
      </div>
    </div>
  );
}

export default SessaoCard;
