import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DirecionamentoForm() {
  const hoje: Date = new Date();
  const navigate = useNavigate();

  let direcionamentoDados = JSON.parse(
    sessionStorage.getItem("direcionamentoDados") || "{}"
  );

  if (Object.keys(direcionamentoDados).length === 0) {
    direcionamentoDados = {
      terapia: null,
      profissional: null,
      apoio: null,
      justificativa: null,
    };

    sessionStorage.setItem(
      "direcionamentoDados",
      JSON.stringify(direcionamentoDados)
    );
  }

  return (
    <div className="flex flex-col gap-3 w-screen h-screen p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin/direcionamento")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">
          {hoje.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
      </div>
      <div className=" p-2 border-1 border-(--yellow-dark) rounded-md">
        <h2 className="p-1 text-sm">Direcionamento:</h2>
        <h2 className="p-1 text-base">Nome do Assistido</h2>
        <h2 className="p-1 text-sm">Para a sessão de: 13:15</h2>
      </div>
      <div className="w-full p-2">
        <p className="text-sm text-neutral-500">Terapia:</p>
        <button
          onClick={() => navigate("/admin/direcionar/pesquisar?item=terapia")}
          className="w-full bg-(--yellow-dark) rounded-md p-2"
        >
          {direcionamentoDados.terapia
            ? direcionamentoDados.terapia
            : "Selecione uma Terapia"}
        </button>
      </div>
      <div className="w-full p-2">
        <p className="text-sm text-neutral-500">Profissional:</p>
        <button
          onClick={() =>
            navigate("/admin/direcionar/pesquisar?item=profissional")
          }
          className="w-full bg-(--yellow-dark) rounded-md p-2"
        >
          {direcionamentoDados.profissional
            ? direcionamentoDados.profissional
            : "Selecione um Profissional"}
        </button>
      </div>
      <div className="w-full p-2">
        <p className="text-sm text-neutral-500">Apoio:</p>
        <button
          onClick={() => navigate("/admin/direcionar/pesquisar?item=apoio")}
          className="w-full bg-(--yellow-dark) rounded-md p-2"
        >
          {direcionamentoDados.apoio
            ? direcionamentoDados.apoio
            : "Selecione um Apoio"}
        </button>
      </div>
      <div className="w-full h-35 p-2">
        <p className="text-sm text-neutral-500">Justificativa:</p>
        <textarea className="w-full h-full bg-white rounded-md p-2 outline-0" />
      </div>

      <button className="w-full bg-(--green) rounded-md p-2 text-white mt-auto font-bold">
        Salvar Direcionamento
      </button>
    </div>
  );
}

export default DirecionamentoForm;
