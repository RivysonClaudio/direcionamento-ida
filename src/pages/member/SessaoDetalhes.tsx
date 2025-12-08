import { X } from "lucide-react";
import type { ISessao } from "../admin/sessoes/ISessao";

interface SessaoDetalhesProps {
  sessao: ISessao | null;
  isOpen: boolean;
  onClose: () => void;
}

function SessaoDetalhes({ sessao, isOpen, onClose }: SessaoDetalhesProps) {
  if (!isOpen || !sessao) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-neutral-800">
            Detalhes da Sessão
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                Horário
              </label>
              <p className="text-base font-semibold text-neutral-800">
                {sessao.horario}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                Terapia
              </label>
              <p className="text-base text-neutral-800">{sessao.terapia}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                Assistido
              </label>
              <p className="text-base text-neutral-800">
                {sessao.assistido_nome}
              </p>
            </div>

            {sessao.profissional_nome && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-500 uppercase">
                  Profissional
                </label>
                <p className="text-base text-neutral-800">
                  {sessao.profissional_nome}
                </p>
              </div>
            )}

            {sessao.apoio_nome && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-neutral-500 uppercase">
                  Apoio
                </label>
                <p className="text-base text-neutral-800">
                  {sessao.apoio_nome}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-neutral-500 uppercase">
                Observações
              </label>
              <p className="text-sm text-neutral-600">
                {sessao.observacoes || "Nenhuma observação"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessaoDetalhes;
