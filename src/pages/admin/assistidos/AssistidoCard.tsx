import { type IAssistido } from "./IAssistido";

function AssistidoCard({
  assistido,
  onClick,
}: {
  assistido: IAssistido;
  onClick: () => void;
}) {
  return (
    <li
      className="p-3 rounded-lg shadow-sm bg-(--yellow) border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${
            assistido.status == "ATIVO" ? "bg-(--green)" : "bg-(--red)"
          }`}
        ></div>
        <p className="text-sm font-semibold text-neutral-800 flex-1 truncate">
          {assistido.nome}
        </p>
      </div>

      <div className="flex gap-4 text-xs text-neutral-600 ml-4">
        <span>
          <span className="font-medium">Nível:</span> {assistido.nivel_suporte}
        </span>
        <span>
          <span className="font-medium">Apoio:</span>{" "}
          {assistido.precisa_apoio ? "Sim" : "Não"}
        </span>
      </div>
    </li>
  );
}

export default AssistidoCard;
