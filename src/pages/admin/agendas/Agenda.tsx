import { useParams, useNavigate } from "react-router-dom";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import { useState, useEffect } from "react";
import type { IAgenda } from "./IAgenda.tsx";
import type { IAssistido } from "../assistidos/IAssistido.tsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AgendaCard from "./AgendaCard.tsx";
import Util from "../../../util/util.tsx";

function Agenda() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [assistido, setAssistido] = useState<IAssistido | null>(null);
  const [day, setDay] = useState<number>(2);
  const [agendas, setAgendas] = useState<IAgenda[]>([]);

  useEffect(() => {
    if (!id) {
      return;
    }

    database
      .get_assistido_by_id(id!)
      .then((data) => setAssistido(data))
      .catch((err) => console.error(err));

    database
      .get_agenda_by_assistido_id(id!)
      .then((data) => setAgendas(data))
      .catch((err) => console.error(err));
  }, [id]);

  function change_day(to: "next" | "prev") {
    let new_day = to === "next" ? day + 1 : day - 1;
    if (new_day < 2) new_day = 6;
    if (new_day > 6) new_day = 2;
    setDay(new_day);
  }

  function get_session_by_day(day: number): IAgenda[] {
    const sessions = agendas.filter((agenda) => agenda.dia_semana == day);
    return Util.sort_agenda_by_time(sessions) || [];
  }

  return (
    <div className="relative flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow) box-border">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin/assistidos")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">Agenda Semanal</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full p-2 rounded-md shadow bg-white">
        <h2 className="col-span-2">{assistido && assistido.nome}</h2>
        <h3 className="text-sm text-start">Nível de suporte:</h3>
        <h3 className="text-sm text-end">
          {assistido && assistido.nivel_suporte}
        </h3>
        <h3 className="text-sm text-start">Necessidade de apoio:</h3>
        <h3 className="text-sm text-end">
          {assistido && assistido.precisa_apoio ? "Sim" : "Não"}
        </h3>
      </div>
      <div className="flex items-center justify-center gap-4 p-2">
        <ChevronLeft className="w-full" onClick={() => change_day("prev")} />
        <p className="w-full text-center text-nowrap">{Util.week[day]}</p>
        <ChevronRight className="w-full" onClick={() => change_day("next")} />
      </div>
      <ul className="flex flex-col gap-2 h-full overflow-y-auto bg-white rounded-md shadow p-2">
        {agendas && get_session_by_day(day).length > 0 ? (
          get_session_by_day(day).map((agenda, index) => (
            <AgendaCard key={index} agenda={agenda} />
          ))
        ) : (
          <p className="text-center text-neutral-500 mt-4">
            Nenhuma sessão agendada para este dia.
          </p>
        )}
      </ul>
      <div className="fixed bottom-0 left-0 w-full p-2"></div>
    </div>
  );
}

export default Agenda;
