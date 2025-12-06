import { ChevronLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IAgenda } from "./IAgenda";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import BottomDialog from "../../../components/BottomDialog";

function AgendaForm() {
  const navigate = useNavigate();
  const { id, agendaId } = useParams<{ id: string; agendaId: string }>();

  const [agenda, setAgenda] = useState<IAgenda | null>(null);
  const [agendaModified, setAgendaModified] = useState(false);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [isApoioDialogOpen, setIsApoioDialogOpen] = useState(false);
  const [isHorarioDialogOpen, setIsHorarioDialogOpen] = useState(false);
  const [isTerapiaDialogOpen, setIsTerapiaDialogOpen] = useState(false);
  const [isAssistidoDialogOpen, setIsAssistidoDialogOpen] = useState(false);
  const [isDiaDialogOpen, setIsDiaDialogOpen] = useState(false);

  const horarios_options = [
    "08:15",
    "09:00",
    "09:45",
    "10:30",
    "11:15",
    "12:00",
    "12:45",
    "13:15",
    "14:00",
    "14:45",
    "15:30",
    "16:15",
    "17:00",
    "17:45",
  ];

  const terapia_options = [
    "ABA - Análise do Comport. Aplic.",
    "Outras terapias",
  ];

  const dias_semana = [
    { value: 1, label: "Segunda-feira" },
    { value: 2, label: "Terça-feira" },
    { value: 3, label: "Quarta-feira" },
    { value: 4, label: "Quinta-feira" },
    { value: 5, label: "Sexta-feira" },
  ];

  useEffect(() => {
    const database = new DatabaseService();

    if (agendaId && agendaId !== "nova") {
      database
        .get_agenda_by_id("id", agendaId)
        .then((data) => {
          setAgenda(data[0] || null);
        })
        .catch((err) => console.error(err));
    } else {
      // Nova agenda
      setAgenda({
        id: "",
        assistido_id: id || "",
        assistido: "",
        profissional_id: "",
        profissional: "",
        apoio_id: "",
        apoio: "",
        terapia: "",
        dia_semana: 1,
        horario: "",
      });
    }
  }, [agendaId, id]);

  const handleSave = async () => {
    if (!agenda) return;

    // const database = new DatabaseService();

    try {
      if (agendaId === "nova") {
        // TODO: Implement create_agenda method
        // await database.create_agenda(agenda);
        mostrarNotificacao("Agenda criada com sucesso!", "success");
        navigate(`/admin/assistidos/${id}/agenda`);
      } else {
        // TODO: Implement update_agenda method
        // await database.update_agenda(agenda);
        setAgendaModified(false);
        mostrarNotificacao("Agenda atualizada com sucesso!", "success");
      }
    } catch (err) {
      console.error(err);
      mostrarNotificacao("Erro ao salvar agenda.", "error");
    }
  };

  const getDiaSemanaNome = (dia: number) => {
    return dias_semana.find((d) => d.value === dia)?.label || "Selecione...";
  };

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-4 bg-(--yellow)">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate(`/admin/assistidos/${id}/agenda`)}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {agendaId === "nova" ? "Nova Agenda" : "Editar Agenda"}
          </h2>
          {agenda?.assistido && agendaId !== "nova" && (
            <p className="text-sm text-neutral-600">
              {agenda.assistido} - {getDiaSemanaNome(agenda.dia_semana)}{" "}
              {agenda.horario}
            </p>
          )}
        </div>
        <button
          disabled={!agendaModified && agendaId !== "nova"}
          onClick={handleSave}
          className={`absolute top-0 right-0 p-2 transition-colors ${
            agendaModified || agendaId === "nova"
              ? "text-green-600 hover:text-green-700"
              : "text-gray-400"
          }`}
          title="Salvar"
        >
          <Save size={24} />
        </button>
      </div>

      <div className="h-full p-3 flex flex-col gap-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto">
        <form action="javascript:void(0)" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Dia da Semana
            </label>
            <button
              type="button"
              onClick={() => setIsDiaDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.dia_semana
                ? getDiaSemanaNome(agenda.dia_semana)
                : "Selecione o dia..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="horario"
              className="text-sm font-medium text-neutral-600"
            >
              Horário
            </label>
            <button
              type="button"
              onClick={() => setIsHorarioDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.horario || "Selecione o horário..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="terapia"
              className="text-sm font-medium text-neutral-600"
            >
              Terapia
            </label>
            <button
              type="button"
              onClick={() => setIsTerapiaDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.terapia || "Selecione a terapia..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Assistido
            </label>
            <button
              type="button"
              onClick={() => setIsAssistidoDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.assistido || "Selecione o assistido..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Profissional
            </label>
            <button
              type="button"
              onClick={() => setIsProfissionalDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.profissional || "Selecione um profissional..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Apoio
            </label>
            <button
              type="button"
              onClick={() => setIsApoioDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.apoio || "Selecione um apoio (opcional)..."}
            </button>
          </div>
        </form>
      </div>

      <BottomDialog
        isOpen={isDiaDialogOpen}
        onClose={() => setIsDiaDialogOpen(false)}
        title="Selecione o Dia da Semana"
      >
        <div className="flex flex-col gap-2">
          {dias_semana.map((dia) => (
            <button
              key={dia.value}
              onClick={() => {
                setAgenda({ ...agenda, dia_semana: dia.value } as IAgenda);
                setAgendaModified(true);
                setIsDiaDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                agenda?.dia_semana === dia.value
                  ? "bg-(--blue) border-blue-300 text-neutral-800"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
              }`}
            >
              {dia.label}
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isTerapiaDialogOpen}
        onClose={() => setIsTerapiaDialogOpen(false)}
        title="Selecione a Terapia"
      >
        <div className="flex flex-col gap-2">
          {terapia_options.map((terapia) => (
            <button
              key={terapia}
              onClick={() => {
                setAgenda({ ...agenda, terapia } as IAgenda);
                setAgendaModified(true);
                setIsTerapiaDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                agenda?.terapia === terapia
                  ? "bg-(--blue) border-blue-300 text-neutral-800"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
              }`}
            >
              {terapia}
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isHorarioDialogOpen}
        onClose={() => setIsHorarioDialogOpen(false)}
        title="Selecione o Horário"
      >
        <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
          {horarios_options.map((horario) => (
            <button
              key={horario}
              onClick={() => {
                setAgenda({ ...agenda, horario } as IAgenda);
                setAgendaModified(true);
                setIsHorarioDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                agenda?.horario === horario
                  ? "bg-(--blue) border-blue-300 text-neutral-800"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
              }`}
            >
              {horario}
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isProfissionalDialogOpen}
        onClose={() => setIsProfissionalDialogOpen(false)}
        title="Selecione o Profissional"
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-500 text-center">
            Lista de profissionais disponíveis
          </p>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isApoioDialogOpen}
        onClose={() => setIsApoioDialogOpen(false)}
        title="Selecione o Apoio"
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-500 text-center">
            Lista de apoios disponíveis
          </p>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isAssistidoDialogOpen}
        onClose={() => setIsAssistidoDialogOpen(false)}
        title="Selecione o Assistido"
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-500 text-center">
            Lista de assistidos disponíveis
          </p>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AgendaForm;
