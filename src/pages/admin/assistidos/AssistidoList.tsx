import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssistidoCard from "./AssistidoCard";
import type { IAssistido } from "./IAssistido";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import { useEffect, useState } from "react";

function AssistidoList() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [thisAssistido, setThisAssistido] = useState<IAssistido | null>(null);
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);

  useEffect(() => {
    database
      .get_assistidos()
      .then((data) => setAssistidos(data))
      .catch((err) => console.error(err));
  }, []);

  function ir_para_agenda_fixa(assistido?: IAssistido) {
    const dialog = document.getElementById(
      "dialog_agenda_fixa"
    ) as HTMLDialogElement;

    if (assistido) {
      setThisAssistido(assistido);
      dialog.showModal();
      return;
    }

    dialog.close();
  }

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">Assistidos</h2>
      </div>

      <div className="p-1">
        <input
          type="text"
          placeholder="Pesquisar"
          className="w-full text-center bg-yellow-200 rounded-md p-1 outline-none"
        />
      </div>

      <ul className="h-full p-2 flex flex-col gap-4 overflow-y-auto rounded-md bg-white">
        {assistidos && assistidos.length > 0 ? (
          assistidos.map((assistido, index) => (
            <AssistidoCard
              key={index}
              assistido={assistido}
              onClick={() => navigate(`${assistido.id}`)}
            />
          ))
        ) : (
          <p className="text-center text-neutral-500">
            Nenhum assistido encontrado.
          </p>
        )}
      </ul>

      <dialog
        id="dialog_agenda_fixa"
        className="overflow-hidden w-full rounded-md m-auto"
      >
        <div className="w-full h-full flex flex-col gap-4 p-4 rounded-md shadow-md bg-(--yellow)">
          <h3 className="text-center font-md">
            Ir para agenda fixa do assistido?
          </h3>
          <h3 className="text-center font-sm truncate">
            {thisAssistido?.nome}
          </h3>
          <div className="w-full flex justify-around">
            <button
              className="px-4 py-2 bg-(--green) rounded-md"
              onClick={() => navigate(`agenda/${thisAssistido?.id}`)}
            >
              Sim
            </button>
            <button
              className="px-4 py-2 bg-(--red) rounded-md"
              onClick={() => ir_para_agenda_fixa()}
            >
              Não
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AssistidoList;
