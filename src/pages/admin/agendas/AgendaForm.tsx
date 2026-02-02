import { ChevronLeft, Save, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { IAgenda } from "./IAgenda";
import type { IAssistido } from "../assistidos/IAssistido";
import type { IProfissional } from "../profissionais/IProfissional";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import BottomDialog from "../../../components/BottomDialog";
import Util from "../../../util/util";

function AgendaForm() {
  const navigate = useNavigate();
  const { id, agendaId } = useParams<{ id: string; agendaId: string }>();
  const [searchParams] = useSearchParams();
  const isFromProfissionais =
    window.location.pathname.includes("/profissionais/");

  const database = DatabaseService.getInstance();

  const [agenda, setAgenda] = useState<IAgenda | null>(null);
  const [agendaModified, setAgendaModified] = useState(false);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [isApoioDialogOpen, setIsApoioDialogOpen] = useState(false);
  const [isHorarioDialogOpen, setIsHorarioDialogOpen] = useState(false);
  const [isTerapiaDialogOpen, setIsTerapiaDialogOpen] = useState(false);
  const [isAssistidoDialogOpen, setIsAssistidoDialogOpen] = useState(false);
  const [isDiaDialogOpen, setIsDiaDialogOpen] = useState(false);
  const [isSalaDialogOpen, setIsSalaDialogOpen] = useState(false);

  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [assistidoSearchTerm, setAssistidoSearchTerm] = useState("");
  const assistidoSearchInputRef = useRef<HTMLInputElement>(null);

  const [profissionais, setProfissionais] = useState<
    (Omit<IProfissional, "role" | "observacoes"> & { is_available: boolean })[]
  >([]);
  const [profissionalSearchTerm, setProfissionalSearchTerm] = useState("");
  const profissionalSearchInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmProfissionalDialogOpen, setIsConfirmProfissionalDialogOpen] =
    useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<
    (Omit<IProfissional, "role" | "observacoes"> & { is_available: boolean }) | null
  >(null);

  const [apoios, setApoios] = useState<
    (Omit<IProfissional, "role" | "observacoes"> & { is_available: boolean })[]
  >([]);
  const [apoioSearchTerm, setApoioSearchTerm] = useState("");
  const apoioSearchInputRef = useRef<HTMLInputElement>(null);
  const [isConfirmApoioDialogOpen, setIsConfirmApoioDialogOpen] = useState(false);
  const [apoioSelecionado, setApoioSelecionado] = useState<
    (Omit<IProfissional, "role" | "observacoes"> & { is_available: boolean }) | null
  >(null);

  const appTurno = localStorage.getItem("app_turno");

  const [salasOcupadas, setSalasOcupadas] = useState<
    Array<{
      week_day: number;
      session_time: string;
      room: number;
      names: string[];
    }>
  >([]);

  const horarios_options = {
    manha: ["07:15", "08:00", "08:45", "09:30", "10:15", "11:00", "11:45"],
    tarde: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"],
  };

  const terapia_options = [
    "ABA - Análise do Comport. Aplic.",
    "Outras terapias",
  ];

  const salas_options = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const dias_semana = [
    { value: 2, label: "Segunda-feira" },
    { value: 3, label: "Terça-feira" },
    { value: 4, label: "Quarta-feira" },
    { value: 5, label: "Quinta-feira" },
    { value: 6, label: "Sexta-feira" },
  ];

  useEffect(() => {
    database
      .get_assistidos(assistidoSearchTerm)
      .then((data) => setAssistidos(data))
      .catch((err) => console.error(err));
  }, [assistidoSearchTerm]);

  useEffect(() => {
    if (!isProfissionalDialogOpen || !agenda?.dia_semana || !agenda?.horario)
      return;

    if (!profissionalSearchTerm) {
      database
        .get_profissionais_disponiveis_para_agendamento_v2(
          agenda.dia_semana,
          agenda.horario,
          "",
        )
        .then((data) => setProfissionais(data))
        .catch((err) => console.error(err));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_profissionais_disponiveis_para_agendamento_v2(
          agenda.dia_semana,
          agenda.horario,
          profissionalSearchTerm,
        )
        .then((data) => setProfissionais(data))
        .catch((err) => console.error(err));
    }, 350);

    return () => clearTimeout(timer);
  }, [
    isProfissionalDialogOpen,
    profissionalSearchTerm,
    agenda?.dia_semana,
    agenda?.horario,
  ]);

  useEffect(() => {
    if (!isApoioDialogOpen || !agenda?.dia_semana || !agenda?.horario) return;

    if (!apoioSearchTerm) {
      database
        .get_profissionais_disponiveis_para_agendamento_v2(
          agenda.dia_semana,
          agenda.horario,
          "",
        )
        .then((data) => setApoios(data))
        .catch((err) => console.error(err));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_profissionais_disponiveis_para_agendamento_v2(
          agenda.dia_semana,
          agenda.horario,
          apoioSearchTerm,
        )
        .then((data) => setApoios(data))
        .catch((err) => console.error(err));
    }, 350);

    return () => clearTimeout(timer);
  }, [isApoioDialogOpen, apoioSearchTerm, agenda?.dia_semana, agenda?.horario]);

  useEffect(() => {
    if (isSalaDialogOpen && agenda?.dia_semana && agenda?.horario) {
      database
        .get_agendas_with_names_by_week_day_time_room()
        .then((data) => setSalasOcupadas(data))
        .catch((err) => console.error(err));
    }
  }, [isSalaDialogOpen, agenda?.dia_semana, agenda?.horario]);

  useEffect(() => {
    if (agendaId && agendaId !== "nova") {
      database
        .get_agenda_by_id("id", agendaId)
        .then((data) => {
          setAgenda(data[0] || null);
        })
        .catch((err) => console.error(err));
    } else {
      // Nova agenda - buscar dados conforme a rota
      if (id) {
        if (isFromProfissionais) {
          // Rota de profissionais - preencher profissional
          database
            .get_profissional_by_id(id)
            .then((profissional) => {
              setAgenda({
                id: "",
                assistido_id: "",
                assistido: "",
                profissional_id: id,
                profissional: profissional?.nome || "",
                apoio_id: "",
                apoio: "",
                terapia: "",
                dia_semana: 1,
                horario: "",
                sala: null,
              });
            })
            .catch((err) => {
              console.error(err);
              setAgenda({
                id: "",
                assistido_id: "",
                assistido: "",
                profissional_id: id,
                profissional: "",
                apoio_id: "",
                apoio: "",
                terapia: "",
                dia_semana: 1,
                horario: "",
                sala: null,
              });
            });
        } else {
          // Rota de assistidos - preencher assistido
          database
            .get_assistido_by_id(id)
            .then((assistido) => {
              const terapia = searchParams.get("terapia");
              const dia = searchParams.get("dia");
              const hora = searchParams.get("hora");

              setAgenda({
                id: "",
                assistido_id: id,
                assistido: assistido?.nome || "",
                profissional_id: "",
                profissional: "",
                apoio_id: "",
                apoio: "",
                terapia:
                  terapia == "ABA" ? terapia_options[0] : "",
                dia_semana: dia ? parseInt(dia, 10) : 1,
                horario: hora || "",
                sala: null,
              });
            })
            .catch((err) => {
              console.error(err);

              const terapia = searchParams.get("terapia");
              const dia = searchParams.get("dia");
              const hora = searchParams.get("hora");

              setAgenda({
                id: "",
                assistido_id: id,
                assistido: "",
                profissional_id: "",
                profissional: "",
                apoio_id: "",
                apoio: "",
                terapia:
                  terapia == "ABA" ? terapia_options[0] : "",
                dia_semana: dia ? parseInt(dia, 10) : 1,
                horario: hora || "",
                sala: null,
              });
            });
        }
      } else {
        setAgenda({
          id: "",
          assistido_id: "",
          assistido: "",
          profissional_id: "",
          profissional: "",
          apoio_id: "",
          apoio: "",
          terapia: "",
          dia_semana: 1,
          horario: "",
          sala: null,
        });
      }
    }
  }, [agendaId, id, isFromProfissionais]);

  const handleSave = async () => {
    if (!agenda) return;

    try {
      if (agendaId === "nova") {
        database.create_agenda(agenda).then(() => {
          mostrarNotificacao("Agenda criada com sucesso!", "success");
          const baseRoute = isFromProfissionais
            ? "/admin/profissionais"
            : "/admin/assistidos";
          navigate(`${baseRoute}/${id}/agenda`);
        });
      } else {
        database.update_agenda(agenda).then(() => {
          setAgendaModified(false);
          mostrarNotificacao("Agenda atualizada com sucesso!", "success");
        });
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
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => {
            const baseRoute = isFromProfissionais
              ? "/admin/profissionais"
              : "/admin/assistidos";
            navigate(`${baseRoute}/${id}/agenda`);
          }}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {agendaId === "nova" ? "Nova Agenda" : "Editar Agenda"}
          </h2>
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

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">Sala</label>
            <button
              type="button"
              onClick={() => setIsSalaDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {agenda?.sala === 0
                ? "Externa"
                : agenda?.sala
                  ? `Sala ${agenda.sala}`
                  : "Selecione a sala..."}
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
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
              }`}
            >
              {dia.label}
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isSalaDialogOpen}
        onClose={() => setIsSalaDialogOpen(false)}
        title="Selecione a Sala"
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-5 gap-2">
            {salas_options
              .filter((sala) => sala !== 0)
              .map((sala) => {
                const salaOcupada = salasOcupadas.find(
                  (s) =>
                    s.room === sala &&
                    s.week_day === agenda?.dia_semana &&
                    s.session_time === agenda?.horario,
                );
                const isOcupada = salaOcupada && salaOcupada.names.length > 0;

                return (
                  <button
                    key={sala}
                    onClick={() => {
                      setAgenda({ ...agenda, sala } as IAgenda);
                      setAgendaModified(true);
                      setIsSalaDialogOpen(false);
                    }}
                    className={`p-3 rounded-lg border transition-all flex flex-col gap-1 ${
                      agenda?.sala === sala
                        ? "bg-blue-500 border-blue-500 text-white"
                        : isOcupada
                          ? "bg-blue-50 border-blue-300 text-neutral-700"
                          : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-sm font-medium">{sala}</span>
                    <span
                      className={`text-xs font-semibold ${
                        agenda?.sala === sala
                          ? "text-blue-100"
                          : isOcupada
                            ? "text-blue-600"
                            : "text-neutral-400"
                      }`}
                    >
                      {isOcupada ? "Ocupada" : "Livre"}
                    </span>
                  </button>
                );
              })}
          </div>
          {/* Sala Externa abaixo das salas normais */}
          {(() => {
            const sala = 0;
            const salaOcupada = salasOcupadas.find(
              (s) =>
                s.room === sala &&
                s.week_day === agenda?.dia_semana &&
                s.session_time === agenda?.horario,
            );
            const isOcupada = salaOcupada && salaOcupada.names.length > 0;

            return (
              <div className="grid grid-cols-5 gap-2">
                <button
                  key={sala}
                  onClick={() => {
                    setAgenda({ ...agenda, sala } as IAgenda);
                    setAgendaModified(true);
                    setIsSalaDialogOpen(false);
                  }}
                  className={`col-span-5 p-3 rounded-lg border transition-all flex flex-col gap-1 ${
                    agenda?.sala === sala
                      ? "bg-blue-500 border-blue-500 text-white"
                      : isOcupada
                        ? "bg-blue-50 border-blue-300 text-neutral-700"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">Externa</span>
                  <span
                    className={`text-xs font-semibold ${
                      agenda?.sala === sala
                        ? "text-blue-100"
                        : isOcupada
                          ? "text-blue-600"
                          : "text-neutral-400"
                    }`}
                  >
                    {isOcupada ? "Ocupada" : "Livre"}
                  </span>
                </button>
              </div>
            );
          })()}
          <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2">
            {salasOcupadas
              .filter(
                (s) =>
                  s.week_day === agenda?.dia_semana &&
                  s.session_time === agenda?.horario &&
                  s.names.length > 0,
              )
              .map((sala) => (
                <div
                  key={sala.room}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-300"
                >
                  <p className="text-sm font-semibold text-blue-700 mb-1">
                    {sala.room === 0 ? "Externa" : `Sala ${sala.room}`} - Ocupada
                  </p>
                  <ul className="flex flex-col gap-1">
                    {sala.names.map((name, idx) => (
                      <li key={idx} className="text-xs text-blue-600">
                        • {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
          <button
            onClick={() => {
              setAgenda({ ...agenda, sala: null } as IAgenda);
              setAgendaModified(true);
              setIsSalaDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
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
                  ? "bg-blue-500 border-blue-500 text-white"
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
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {appTurno === "MANHA" && (
            <div>
              <h4 className="text-xs font-semibold text-neutral-600 mb-2">
                Manhã
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {horarios_options.manha.map((horario) => (
                  <button
                    key={horario}
                    onClick={() => {
                      setAgenda({ ...agenda, horario } as IAgenda);
                      setAgendaModified(true);
                      setIsHorarioDialogOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      agenda?.horario === horario
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>
            )}
            {appTurno === "TARDE" && (
            <div>
              <h4 className="text-xs font-semibold text-neutral-600 mb-2">
                Tarde
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {horarios_options.tarde.map((horario) => (
                  <button
                    key={horario}
                    onClick={() => {
                      setAgenda({ ...agenda, horario } as IAgenda);
                      setAgendaModified(true);
                      setIsHorarioDialogOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      agenda?.horario === horario
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>
          <button
            onClick={() => {
              setAgenda({ ...agenda, horario: "" } as IAgenda);
              setAgendaModified(true);
              setIsHorarioDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isProfissionalDialogOpen}
        onClose={() => setIsProfissionalDialogOpen(false)}
        title="Selecione o Profissional"
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={20}
              />
              <input
                type="text"
                ref={profissionalSearchInputRef}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
                value={profissionalSearchTerm}
                onChange={(e) => setProfissionalSearchTerm(e.target.value)}
                onFocus={() => Util.handleFocus(profissionalSearchInputRef)}
              />
            </div>
          </div>
          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{
              minHeight: profissionais.length <= 3 ? "250px" : "auto",
              maxHeight: "350px",
            }}
          >
            {profissionais.length > 0 ? (
              profissionais.map((profissional) => (
                <button
                  key={profissional.id}
                  onClick={() => {
                    if (!profissional.is_available) {
                      // Profissional em atendimento - abrir modal de confirmação
                      setProfissionalSelecionado(profissional);
                      setIsConfirmProfissionalDialogOpen(true);
                    } else {
                      // Profissional disponível - atribuir diretamente
                      setAgenda({
                        ...agenda,
                        profissional_id: profissional.id,
                        profissional: profissional.nome,
                      } as IAgenda);
                      setAgendaModified(true);
                      setIsProfissionalDialogOpen(false);
                    }
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex flex-col items-start gap-0.5 ${
                    agenda?.profissional_id === profissional.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  <span>{profissional.nome}</span>
                  <span
                    className={`text-xs font-normal ${
                      agenda?.profissional_id === profissional.id
                        ? "text-blue-100"
                        : profissional.is_available
                          ? "text-green-600"
                          : "text-amber-600"
                    }`}
                  >
                    {profissional.is_available ? "Disponível" : "Já agendado"}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center">
                Nenhum profissional encontrado.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setAgenda({
                ...agenda,
                profissional_id: "",
                profissional: "",
              } as IAgenda);
              setAgendaModified(true);
              setIsProfissionalDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isApoioDialogOpen}
        onClose={() => setIsApoioDialogOpen(false)}
        title="Selecione o Apoio"
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={20}
              />
              <input
                type="text"
                ref={apoioSearchInputRef}
                placeholder="Buscar por nome..."
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
                value={apoioSearchTerm}
                onChange={(e) => setApoioSearchTerm(e.target.value)}
                onFocus={() => Util.handleFocus(apoioSearchInputRef)}
              />
            </div>
          </div>
          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{
              minHeight: apoios.length <= 3 ? "250px" : "auto",
              maxHeight: "350px",
            }}
          >
            {apoios.length > 0 ? (
              apoios.map((apoio) => (
                <button
                  key={apoio.id}
                  onClick={() => {
                    if (!apoio.is_available) {
                      // Apoio em atendimento - abrir modal de confirmação
                      setApoioSelecionado(apoio);
                      setIsConfirmApoioDialogOpen(true);
                    } else {
                      // Apoio disponível - atribuir diretamente
                      setAgenda({
                        ...agenda,
                        apoio_id: apoio.id,
                        apoio: apoio.nome,
                      } as IAgenda);
                      setAgendaModified(true);
                      setIsApoioDialogOpen(false);
                    }
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left flex flex-col items-start gap-0.5 ${
                    agenda?.apoio_id === apoio.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  <span>{apoio.nome}</span>
                  <span
                    className={`text-xs font-normal ${
                      agenda?.apoio_id === apoio.id
                        ? "text-blue-100"
                        : apoio.is_available
                          ? "text-green-600"
                          : "text-amber-600"
                    }`}
                  >
                    {apoio.is_available ? "Disponível" : "Já agendado"}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center">
                Nenhum apoio encontrado.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setAgenda({
                ...agenda,
                apoio_id: "",
                apoio: "",
              } as IAgenda);
              setAgendaModified(true);
              setIsApoioDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isAssistidoDialogOpen}
        onClose={() => setIsAssistidoDialogOpen(false)}
        title="Selecione o Assistido"
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              type="text"
              ref={assistidoSearchInputRef}
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={assistidoSearchTerm}
              onChange={(e) => {
                Util.handleFocus(assistidoSearchInputRef);
                setAssistidoSearchTerm(e.target.value);
              }}
              onFocus={() => Util.handleFocus(assistidoSearchInputRef)}
            />
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {assistidos.length > 0 ? (
              assistidos.map((assistido) => (
                <button
                  key={assistido.id}
                  onClick={() => {
                    setAgenda({
                      ...agenda,
                      assistido_id: assistido.id,
                      assistido: assistido.nome,
                    } as IAgenda);
                    setAgendaModified(true);
                    setIsAssistidoDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    agenda?.assistido_id === assistido.id
                      ? "bg-(--blue) border-blue-300 text-neutral-800"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  {assistido.nome}
                </button>
              ))
            ) : (
              <p className="text-sm text-neutral-500 text-center">
                Nenhum assistido encontrado.
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setAgenda({
                ...agenda,
                assistido_id: "",
                assistido: "",
              } as IAgenda);
              setAgendaModified(true);
              setIsAssistidoDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>

      {/* Modal de confirmação para profissional em atendimento */}
      <BottomDialog
        isOpen={isConfirmProfissionalDialogOpen}
        onClose={() => {
          setIsConfirmProfissionalDialogOpen(false);
          setProfissionalSelecionado(null);
        }}
        title="Confirmar Seleção"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-700">
              O profissional <span className="font-semibold">{profissionalSelecionado?.nome}</span> já possui
              uma agenda neste horário.
            </p>
            <p className="text-sm text-neutral-600">
              Deseja mesmo atribuir este profissional à agenda?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsConfirmProfissionalDialogOpen(false);
                setProfissionalSelecionado(null);
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (profissionalSelecionado) {
                  setAgenda({
                    ...agenda,
                    profissional_id: profissionalSelecionado.id,
                    profissional: profissionalSelecionado.nome,
                  } as IAgenda);
                  setAgendaModified(true);
                  setIsConfirmProfissionalDialogOpen(false);
                  setIsProfissionalDialogOpen(false);
                  setProfissionalSelecionado(null);
                }
              }}
              className="flex-1 p-3 rounded-lg border border-blue-500 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </BottomDialog>

      {/* Modal de confirmação para apoio em atendimento */}
      <BottomDialog
        isOpen={isConfirmApoioDialogOpen}
        onClose={() => {
          setIsConfirmApoioDialogOpen(false);
          setApoioSelecionado(null);
        }}
        title="Confirmar Seleção"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-neutral-700">
              O profissional de apoio <span className="font-semibold">{apoioSelecionado?.nome}</span> já possui
              uma agenda neste horário.
            </p>
            <p className="text-sm text-neutral-600">
              Deseja mesmo atribuir este profissional de apoio à agenda?
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsConfirmApoioDialogOpen(false);
                setApoioSelecionado(null);
              }}
              className="flex-1 p-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (apoioSelecionado) {
                  setAgenda({
                    ...agenda,
                    apoio_id: apoioSelecionado.id,
                    apoio: apoioSelecionado.nome,
                  } as IAgenda);
                  setAgendaModified(true);
                  setIsConfirmApoioDialogOpen(false);
                  setIsApoioDialogOpen(false);
                  setApoioSelecionado(null);
                }
              }}
              className="flex-1 p-3 rounded-lg border border-blue-500 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      </BottomDialog>
    </div>
  );
}

export default AgendaForm;
