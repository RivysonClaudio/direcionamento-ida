import { useState } from "react";

function SeletorDeDias() {
  const dias: string[] = ["Ontem", "Hoje", "Amanhã"];

  const [diaSelecionado, setDiaSelecionado] = useState("Hoje");

  return (
    <div className="grid grid-cols-3 p-1 bg-white rounded-md">
      {dias.map((dia) => (
        <button
          key={dia}
          className={`text-center rounded-md ${
            diaSelecionado === dia ? "bg-(--yellow-dark)" : "text-neutral-500"
          }`}
          onClick={() => {
            setDiaSelecionado(dia);
          }}
        >
          {dia}
        </button>
      ))}
    </div>
  );
}

export default SeletorDeDias;
