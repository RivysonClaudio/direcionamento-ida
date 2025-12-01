import { type IAssistido } from "./IAssistido";

function AssistidoCard({
  assistido,
  onClick,
}: {
  assistido: IAssistido;
  onClick: () => void;
}) {
  return (
    <li className="p-2 rounded-md shadow-md bg-(--yellow)" onClick={onClick}>
      <div className="flex items-baseline gap-2">
        <div
          className={`w-2 h-2 rounded-full
            ${assistido.status == "ATIVO" ? "bg-(--green)" : "bg-(--red)"}
          `}
        ></div>
        <p className="text-start text-base flex-1 truncate">{assistido.nome}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1 px-2">
        <span className="text-sm text-neutral-500 text-start">
          Nivel suporte:
        </span>
        <span className="text-sm text-neutral-500 text-end">
          {assistido.nivel_suporte}
        </span>
        <span className="text-sm text-neutral-500 text-start">
          Precisa de apoio:
        </span>
        <span className="text-sm text-neutral-500 text-end">
          {assistido.precisa_apoio ? "Sim" : "Não"}
        </span>
      </div>
    </li>
  );
}

export default AssistidoCard;
