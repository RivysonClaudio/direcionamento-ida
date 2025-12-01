import { ChevronLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeletorDeDias from "../../../components/SeletorDeDias";
import SessaoResumoCardProfissional from "./SessaoResumoCardProfissional";

function SessaoResumo() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">Sessões</h2>
      </div>
      <div className="flex items-center justify-center gap-2 p-2 pb-3">
        <div className="w-5 h-5 rounded-full bg-red-500 border-4 border-red-400"></div>
        <h2 className="text-center">1 Direcionamento pendente</h2>
      </div>
      <SeletorDeDias />
      <ul className="h-full p-2 flex flex-col gap-8 overflow-y-auto rounded-md bg-white">
        <SessaoResumoCardProfissional />
      </ul>
      <div className="flex gap-4">
        <button className="w-full flex py-2 justify-center items-center rounded-md bg-(--blue)">
          Gerar agenda
        </button>
        <button className="bg-(--yellow-dark) p-2 text-neutral-500 rounded-md">
          <Filter />
        </button>
      </div>
    </div>
  );
}

export default SessaoResumo;
