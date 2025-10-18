import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeletorDeDias from "../components/SeletorDeDias";

function DirecionamentoView() {
  const hoje: Date = new Date();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-screen h-screen p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin/direcionamento-lista")}
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
      <div className="grid grid-cols-2 gap-2 w-full p-2 border-1 border-(--yellow-dark) rounded-md shadow">
        <h2 className="col-span-2">Nome do assistido</h2>
        <h3 className="text-sm text-start">Idade:</h3>
        <h3 className="text-sm text-end">10</h3>
        <h3 className="text-sm text-start">Nível de suporte:</h3>
        <h3 className="text-sm text-end">2</h3>
        <h3 className="text-sm text-start">Necessidade de apoio:</h3>
        <h3 className="text-sm text-end">SIM</h3>
      </div>
      <SeletorDeDias />
      <ul className="flex flex-col gap-4 h-full py-2 overflow-y-auto">
        <li
          onClick={() => navigate("/admin/direcionar")}
          className="grid grid-cols-2 gap-2 text-center bg-(--red) rounded-md pb-1"
        >
          <p className="col-span-2 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
            13:15
          </p>
          <h3 className="text-sm text-start pl-2">Terapia:</h3>
          <h3 className="text-sm text-end pr-2">--</h3>
          <h3 className="text-sm text-start pl-2">Profissional:</h3>
          <h3 className="text-sm text-end pr-2">--</h3>
          <h3 className="text-sm text-start pl-2">Apoio:</h3>
          <h3 className="text-sm text-end pr-2">--</h3>
        </li>
        <li className="grid grid-cols-2 gap-2 text-center bg-(--green) rounded-md pb-1">
          <p className="col-span-2 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
            14:00
          </p>
          <h3 className="text-sm text-start pl-2">Terapia:</h3>
          <h3 className="text-sm text-end pr-2">Nome da Terapia</h3>
          <h3 className="text-sm text-start pl-2">Profissional:</h3>
          <h3 className="text-sm text-end pr-2">Nome do Profissional</h3>
          <h3 className="text-sm text-start pl-2">Apoio:</h3>
          <h3 className="text-sm text-end pr-2">Nome de Apoio</h3>
        </li>
        <li className="grid grid-cols-2 gap-2 text-center bg-(--green) rounded-md pb-1">
          <p className="col-span-2 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
            14:45
          </p>
          <h3 className="text-sm text-start pl-2">Terapia:</h3>
          <h3 className="text-sm text-end pr-2">Nome da Terapia</h3>
          <h3 className="text-sm text-start pl-2">Profissional:</h3>
          <h3 className="text-sm text-end pr-2">Nome do Profissional</h3>
          <h3 className="text-sm text-start pl-2">Apoio:</h3>
          <h3 className="text-sm text-end pr-2">Nome de Apoio</h3>
        </li>
        <li className="grid grid-cols-2 gap-2 text-center bg-(--green) rounded-md pb-1">
          <p className="col-span-2 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
            15:30
          </p>
          <h3 className="text-sm text-start pl-2">Terapia:</h3>
          <h3 className="text-sm text-end pr-2">Nome da Terapia</h3>
          <h3 className="text-sm text-start pl-2">Profissional:</h3>
          <h3 className="text-sm text-end pr-2">Nome do Profissional</h3>
          <h3 className="text-sm text-start pl-2">Apoio:</h3>
          <h3 className="text-sm text-end pr-2">Nome de Apoio</h3>
        </li>
        <li className="grid grid-cols-2 gap-2 text-center bg-(--green) rounded-md pb-1">
          <p className="col-span-2 text-center rounded-md shadow pt-1 font-semibold text-neutral-600">
            16:15
          </p>
          <h3 className="text-sm text-start pl-2">Terapia:</h3>
          <h3 className="text-sm text-end pr-2">Nome da Terapia</h3>
          <h3 className="text-sm text-start pl-2">Profissional:</h3>
          <h3 className="text-sm text-end pr-2">Nome do Profissional</h3>
          <h3 className="text-sm text-start pl-2">Apoio:</h3>
          <h3 className="text-sm text-end pr-2">Nome de Apoio</h3>
        </li>
      </ul>
    </div>
  );
}

export default DirecionamentoView;
