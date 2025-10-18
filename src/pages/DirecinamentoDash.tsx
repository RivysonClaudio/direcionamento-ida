import { LogOut } from "lucide-react";
import SeletorDeDias from "../components/SeletorDeDias";
import { useNavigate } from "react-router-dom";
import SeletorDeSessoes from "../components/SeletorDeSessoes";
import DirecionamentoAviso from "../components/DirecionamentoAviso";

function DirecinamentoDash() {
  const hoje: Date = new Date();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-screen h-screen p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <h2 className="text-center">
          {hoje.toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
        <LogOut
          onClick={() => navigate("/login")}
          className="absolute top-0 right-0 p-1 text-neutral-600 h-full"
        />
      </div>
      <SeletorDeDias />
      <DirecionamentoAviso />
      <SeletorDeSessoes />
      <div className="p-1">
        <input
          type="text"
          placeholder="Pesquisar"
          className="w-full text-center bg-yellow-200 rounded-md p-1 outline-none"
        />
      </div>
      <ul className="h-full p-2 flex flex-col gap-2 overflow-y-auto rounded-md bg-white">
        <li className="p-1 px-2 rounded-md shadow-md bg-(--yellow)">
          <p className="text-start text-base">Nome do assistido</p>
          <p className="text-start text-sm text-neutral-500">
            Nome do Terapeuta
          </p>
        </li>
      </ul>
      <ul className="grid grid-cols-4 bg-white p-1 rounded-md shadow-md">
        <li className="text-center p-1 text-sm border-r-1 border-neutral-300">
          Assistidos
        </li>
        <li className="text-center p-1 text-sm border-r-1 border-neutral-300">
          Terapias
        </li>
        <li className="text-center p-1 text-sm border-r-1 border-neutral-300">
          Agendas
        </li>
        <li className="text-center p-1 text-sm">Terapeutas</li>
      </ul>
    </div>
  );
}

export default DirecinamentoDash;
