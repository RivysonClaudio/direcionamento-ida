import { type IProfissional } from "./IProfissional";

function ProfissionalCard({
  profissional,
  onClick,
}: {
  profissional: IProfissional;
  onClick: () => void;
}) {
  return (
    <li
      className="p-3 rounded-lg shadow-sm bg-(--yellow) border border-yellow-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-2 h-2 rounded-full ${
            profissional.status == "ATIVO" ? "bg-(--green)" : "bg-(--red)"
          }`}
        ></div>
        <p className="text-sm flex-1 truncate font-semibold text-neutral-800">
          {profissional.nome}
        </p>
      </div>
      <p className="text-xs text-neutral-600 ml-4">
        {profissional.funcao || "Função não especificada"}
      </p>
    </li>
  );
}

export default ProfissionalCard;
