import { useParams, useNavigate, useLocation } from "react-router-dom";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import { useState, useEffect } from "react";
import type { IAgenda } from "./IAgenda.tsx";
import type { IAssistido } from "../assistidos/IAssistido.tsx";
import type { IProfissional } from "../profissionais/IProfissional.tsx";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import AgendaCard from "./AgendaCard.tsx";
import Util from "../../../util/util.tsx";
import BottomDialog from "../../../components/BottomDialog.tsx";
import { mostrarNotificacao } from "../../../util/notificacao.ts";

function AgendaList() {
  const { id } = useParams<{ id: string; agendaId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const database = DatabaseService.getInstance();
  
  const isProfissional = location.pathname.includes("/profissionais/");
  
  const [assistido, setAssistido] = useState<IAssistido | null>(null);
  const [profissional, setProfissional] = useState<IProfissional | null>(null);
  const [day, setDay] = useState<number>(() => {
    const savedDay = localStorage.getItem("agenda_selectedDay");
    return savedDay ? parseInt(savedDay) : 2;
  });
  const [agendas, setAgendas] = useState<IAgenda[]>([]);
  const [isOptionsDialogOpen, setIsOptionsDialogOpen] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState<IAgenda | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    if (isProfissional) {
      database
        .get_profissional_by_id(id!)
        .then((data) => setProfissional(data))
        .catch((err) => console.error(err));

      database
        .get_agenda_by_id("professional_id", id!)
        .then((data) => setAgendas(data))
        .catch((err) => console.error(err));
    } else {
      database
        .get_assistido_by_id(id!)
        .then((data) => setAssistido(data))
        .catch((err) => console.error(err));

      database
        .get_agenda_by_id("patient_id", id!)
        .then((data) => setAgendas(data))
        .catch((err) => console.error(err));
    }
  }, [id, isProfissional]);

  function change_day(to: "next" | "prev") {
    let new_day = to === "next" ? day + 1 : day - 1;
    if (new_day < 2) new_day = 6;
    if (new_day > 6) new_day = 2;
    setDay(new_day);
    localStorage.setItem("agenda_selectedDay", new_day.toString());
  }

  function get_session_by_day(day: number): IAgenda[] {
    const sessions = agendas.filter((agenda) => agenda.dia_semana == day);
    return Util.sort_agenda_by_time(sessions) || [];
  }

  function handleLongPress(agenda: IAgenda) {
    setSelectedAgenda(agenda);
    setIsOptionsDialogOpen(true);
  }

  function handleDeleteAgenda() {
    if (selectedAgenda) {
      database.delete_agenda(selectedAgenda.id).then(() => {
        setAgendas(agendas.filter((a) => a.id !== selectedAgenda.id));
        setSelectedAgenda(null);
      });
      mostrarNotificacao("Agenda excluída com sucesso.", "success");
    }
    setIsOptionsDialogOpen(false);
  }

  const basePath = isProfissional ? "/admin/profissionais" : "/admin/assistidos";

  return (
    <div className="relative flex flex-col gap-3 h-full p-4 box-border">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`${basePath}/${id}`)}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">Agenda Semanal</h2>
        </div>
        <button
          onClick={() => navigate(`${basePath}/${id}/agenda/nova`)}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-green-600 transition-colors"
          title="Nova Agenda"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-neutral-800">
            {isProfissional ? profissional?.nome : assistido?.nome}
          </h2>
          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
            {isProfissional ? (
              <>
                <span>{profissional?.funcao}</span>
                <span>•</span>
                <span>{profissional?.turno}</span>
              </>
            ) : (
              <>
                <span>{assistido?.nivel_suporte}</span>
                <span>•</span>
                <span>{assistido?.precisa_apoio ? "Com apoio" : "Sem apoio"}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => change_day("prev")}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-gray-50 rounded-lg transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-lg font-bold text-neutral-800">{Util.week[day]}</p>
        </div>
        <button
          onClick={() => change_day("next")}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-gray-50 rounded-lg transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <ul className="flex flex-col gap-3 h-full overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-2">
        {agendas && get_session_by_day(day).length > 0 ? (
          get_session_by_day(day).map((agenda, index) => (
            <AgendaCard
              key={index}
              agenda={agenda}
              onClick={() =>
                navigate(`${basePath}/${id}/agenda/${agenda.id}`)
              }
              onLongPress={() => handleLongPress(agenda)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">
              Nenhuma sessão agendada para este dia.
            </p>
          </div>
        )}
      </ul>

      <BottomDialog
        isOpen={isOptionsDialogOpen}
        onClose={() => setIsOptionsDialogOpen(false)}
        title="Deseja excluir esta agenda?"
      >
        <div className="flex gap-2">
          <button
            className="flex w-full items-center justify-center gap-3 p-3 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-700"
            onClick={() => setIsOptionsDialogOpen(false)}
          >
            Cancelar
          </button>
          <button
            className="flex w-full items-center justify-center gap-3 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            onClick={handleDeleteAgenda}
          >
            <Trash2 size={20} className="text-red-500" />
            <span className="font-medium">Excluir</span>
          </button>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AgendaList;
