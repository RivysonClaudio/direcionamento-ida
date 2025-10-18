import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function DirecionamentoLista() {
  const hoje: Date = new Date();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-screen h-screen p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin")}
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
      <div className="flex items-center justify-center gap-2 p-2 pb-3">
        <div className="w-5 h-5 rounded-full bg-red-500 border-4 border-red-400"></div>
        <h2 className="text-center">1 Direcionamento pendente</h2>
      </div>
      <div className="p-1">
        <input
          type="text"
          placeholder="Pesquisar"
          className="w-full text-center bg-yellow-200 rounded-md p-1 outline-none"
        />
      </div>
      <ul className="h-full p-2 flex flex-col gap-4 overflow-y-auto rounded-md bg-white">
        <li
          onClick={() => navigate("/admin/direcionamento")}
          className="grid gap-2 bg-(--yellow) p-2 rounded-md shadow-md"
        >
          <p className="w-full h-full flex items-center border-1 border-neutral-300 p-1 px-2 rounded-md">
            Nome do assistido
          </p>
          <ul className="grid grid-cols-4 gap-1 text-center">
            <li className="bg-(--red) rounded-md">13:15</li>
            <li className="bg-(--green) rounded-md">14:00</li>
            <li className="bg-(--green) rounded-md">14:45</li>
            <li className="bg-(--green) rounded-md">15:30</li>
            <li className="bg-(--green) rounded-md">16:15</li>
            <li className="bg-(--green) rounded-md">17:00</li>
            <li className="bg-(--green) rounded-md">17:45</li>
            <li className="bg-(--green) rounded-md">18:30</li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default DirecionamentoLista;
