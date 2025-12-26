import type { IMedAgenda } from "./IMedAgenda";
import { useState } from "react";
import BottomDialog from "../../../components/BottomDialog";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import { useNavigate } from "react-router-dom";

interface MedAgendaCardProps {
  agenda: IMedAgenda;
  onUpdate?: () => void;
}

function MedAgendaCard({ agenda, onUpdate }: MedAgendaCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const database = DatabaseService.getInstance();
  const navigate = useNavigate();
  const diasDaSemana: Record<number, string> = {
    2: "Segunda",
    3: "Terça",
    4: "Quarta",
    5: "Quinta",
    6: "Sexta",
  };

  const getStatusLabel = () => {
    switch (agenda.agenda_med_sync) {
      case "sync":
        return "Sincronizado";
      case "only_in_app":
        return "APP";
      case "only_in_med":
        return "MED";
      default:
        return "Desconhecido";
    }
  };

  const getStatusColor = () => {
    switch (agenda.agenda_med_sync) {
      case "sync":
        return "bg-green-100 text-green-700";
      case "only_in_app":
        return "bg-red-100 text-red-700";
      case "only_in_med":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleDelete = async () => {
    if (!agenda.schedule_id) {
      mostrarNotificacao("ID do agendamento não encontrado", "error");
      setIsDialogOpen(false);
      return;
    }

    try {
      await database.delete_agenda(agenda.schedule_id);
      setIsDialogOpen(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      mostrarNotificacao("Erro ao deletar agendamento: " + error, "error");
    }
  };

  const handleCreate = () => {
    navigate(
      `/admin/assistidos/${agenda.patient_id}/agenda/nova?med=${agenda.agenda_med_id}&terapia=ABA&dia=${agenda.week_day}&hora=${agenda.session_time}`
    );
    setIsDialogOpen(false);
  };

  const handleNavigate = () => {
    navigate(
      `/admin/assistidos/${agenda.patient_id}/agenda/${agenda.schedule_id}`
    );
    setIsDialogOpen(false);
  };

  return (
    <>
      <li
        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold text-neutral-800">
            {agenda.patient_name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <span>{diasDaSemana[agenda.week_day]}</span>
              <span>•</span>
              <span>{agenda.session_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor()}`}
              >
                {getStatusLabel()}
              </span>
            </div>
          </div>
          {agenda.med_description && (
            <p className="text-xs text-neutral-500">{agenda.med_description}</p>
          )}
        </div>
      </li>

      <BottomDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Ações Disponíveis"
      >
        <div className="flex flex-col gap-3 p-4">
          {agenda.agenda_med_sync === "only_in_app" && (
            <>
              <button
                onClick={handleDelete}
                className="py-3 px-4 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
              >
                Apagar Agendamento
              </button>
            </>
          )}
          {agenda.agenda_med_sync === "only_in_med" && !agenda.is_ignored && (
            <>
              <button
                onClick={handleCreate}
                className="py-3 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
              >
                Criar Agendamento
              </button>
              <button
                onClick={async () => {
                  try {
                    await database.ignore_medtherapy_agenda(
                      agenda.agenda_med_id
                    );
                    setIsDialogOpen(false);
                    if (onUpdate) {
                      onUpdate();
                    }
                  } catch (error) {
                    mostrarNotificacao(
                      "Erro ao ignorar agenda: " + error,
                      "error"
                    );
                  }
                }}
                className="py-3 px-4 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors font-medium"
              >
                Ignorar
              </button>
            </>
          )}
          {agenda.agenda_med_sync === "sync" && (
            <button
              onClick={handleNavigate}
              className="py-3 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors font-medium"
            >
              Ir para Agendamento
            </button>
          )}
          <button
            onClick={() => setIsDialogOpen(false)}
            className="py-3 px-4 rounded-lg border border-gray-300 text-neutral-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </BottomDialog>
    </>
  );
}

export default MedAgendaCard;
