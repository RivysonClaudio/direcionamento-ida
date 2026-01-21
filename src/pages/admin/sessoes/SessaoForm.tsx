import { ChevronLeft, Save, Search, Pin } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ISessao } from "./ISessao";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import BottomDialog from "../../../components/BottomDialog";
import Util from "../../../util/util";
import type { IAssistido } from "../assistidos/IAssistido";
import type { IProfissional } from "../profissionais/IProfissional";

function SessaoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const database = DatabaseService.getInstance();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [sessaoModified, setSessaoModified] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(
    localStorage.getItem("sessao_selectedDay") || "HOJE",
  );
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [apoios, setApoios] = useState<IProfissional[]>([]);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [isApoioDialogOpen, setIsApoioDialogOpen] = useState(false);
  const [isHorarioDialogOpen, setIsHorarioDialogOpen] = useState(false);
  const [isTerapiaDialogOpen, setIsTerapiaDialogOpen] = useState(false);
  const [isAssistidoDialogOpen, setIsAssistidoDialogOpen] = useState(false);
  const [isSalaDialogOpen, setIsSalaDialogOpen] = useState(false);
  const [assistidoSearchTerm, setAssistidoSearchTerm] = useState("");
  const [profissionalSearchTerm, setProfissionalSearchTerm] = useState("");
  const [apoioSearchTerm, setApoioSearchTerm] = useState("");
  const [isProfissionalPinned, setIsProfissionalPinned] = useState(true);
  const [isApoioPinned, setIsApoioPinned] = useState(true);

  const [salasOcupadas, setSalasOcupadas] = useState<
    Array<{
      date: string;
      session_time: string;
      room: number;
      names: string[];
    }>
  >([]);

  const observacoesInputRef = useRef<HTMLTextAreaElement>(null);
  const assistidoSearchInputRef = useRef<HTMLInputElement>(null);
  const profissionalSearchInputRef = useRef<HTMLInputElement>(null);
  const apoioSearchInputRef = useRef<HTMLInputElement>(null);

  const status_options: Array<"PENDENTE" | "AGENDADO" | "CANCELADO"> = [
    "PENDENTE",
    "AGENDADO",
    "CANCELADO",
  ];

  const horarios_options = {
    manha: ["07:15", "08:00", "08:45", "09:30", "10:15", "11:00", "11:45"],
    tarde: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"],
  };

  const terapia_optrions = [
    "ABA - Análise do Comport. Aplic.",
    "ABA - Análise do Comport. Aplic. (Extra)",
    "Outras terapias",
  ];

  const salas_options = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  useEffect(() => {
    if (!isAssistidoDialogOpen || !sessao?.data || !sessao?.horario) return;

    if (!assistidoSearchTerm) {
      database
        .get_assistidos_disponiveis(sessao.data, sessao.horario, "")
        .then((data) => setAssistidos(data))
        .catch((err) => mostrarNotificacao(err.message, "error"));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_assistidos_disponiveis(
          sessao.data,
          sessao.horario,
          assistidoSearchTerm,
        )
        .then((data) => setAssistidos(data))
        .catch((err) => mostrarNotificacao(err.message, "error"));
    }, 350);

    return () => clearTimeout(timer);
  }, [
    isAssistidoDialogOpen,
    sessao?.data,
    sessao?.horario,
    assistidoSearchTerm,
  ]);

  useEffect(() => {
    if (!isProfissionalDialogOpen || !sessao?.data || !sessao?.horario) return;

    if (!profissionalSearchTerm) {
      database
        .get_profissionais_disponiveis(
          sessao.data,
          sessao.horario,
          isProfissionalPinned ? sessao.assistido_id : null,
          "",
        )
        .then((data) => setProfissionais(data))
        .catch((err) => mostrarNotificacao(err.message, "error"));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_profissionais_disponiveis(
          sessao.data,
          sessao.horario,
          isProfissionalPinned ? sessao.assistido_id : null,
          profissionalSearchTerm,
        )
        .then((data) => setProfissionais(data))
        .catch((err) => mostrarNotificacao(err.message, "error"));
    }, 350);

    return () => clearTimeout(timer);
  }, [
    isProfissionalDialogOpen,
    isProfissionalPinned,
    sessao?.assistido_id,
    sessao?.data,
    sessao?.horario,
    profissionalSearchTerm,
  ]);

  useEffect(() => {
    if (isApoioDialogOpen && sessao?.data && sessao?.horario) {
      database
        .get_profissionais_disponiveis(
          sessao.data,
          sessao.horario,
          isApoioPinned ? sessao.assistido_id : null,
          apoioSearchTerm,
        )
        .then((data) => setApoios(data))
        .catch((err) => mostrarNotificacao(err.message, "error"));
    }
  }, [
    isApoioDialogOpen,
    isApoioPinned,
    sessao?.assistido_id,
    sessao?.data,
    sessao?.horario,
    apoioSearchTerm,
  ]);

  useEffect(() => {
    if (isSalaDialogOpen && sessao?.data && sessao?.horario) {
      database
        .get_therapy_sessions_with_names_by_date_time_room()
        .then((data) => setSalasOcupadas(data))
        .catch((err) => console.error(err));
    }
  }, [isSalaDialogOpen, sessao?.data, sessao?.horario]);

  useEffect(() => {
    if (id && id !== "novo") {
      database
        .get_sessao_by_id(id)
        .then((data) => {
          setSessao(data);
          // Set data selector based on loaded date
          if (data?.data === Util.iso_date(0)) {
            setDataSelecionada("HOJE");
          } else if (data?.data === Util.iso_date(1)) {
            setDataSelecionada("AMANHÃ");
          }
        })
        .catch((err) => console.error(err));
    } else {
      // Nova sessão - default to today
      setSessao({
        id: "",
        data: Util.iso_date(
          dataSelecionada === "ONTEM" ? -1 : dataSelecionada === "HOJE" ? 0 : 1,
        ),
        status: "PENDENTE",
        terapia: "",
        horario: "",
        sala: null,
        assistido_id: "",
        assistido_situacao: "",
        assistido_nome: "",
        profissional_id: "",
        profissional_situacao: "",
        profissional_nome: "",
        apoio_id: "",
        apoio_situacao: "",
        apoio_nome: "",
        observacoes: "",
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!sessao) return;

    if (
      sessao &&
      sessao.profissional_situacao === "INATIVO" &&
      sessao.status == "AGENDADO"
    )
      return mostrarNotificacao(
        "Não é possível atribuir um profissional inativo à sessão.",
        "error",
      );
    if (
      sessao &&
      sessao.apoio_situacao === "INATIVO" &&
      sessao.status == "AGENDADO"
    )
      return mostrarNotificacao(
        "Não é possível atribuir um profissional de apoio inativo à sessão.",
        "error",
      );

    try {
      if (id === "novo") {
        await database.create_sessao(sessao);
        mostrarNotificacao("Sessão criada com sucesso!", "success");
        navigate("/admin/sessoes");
      } else {
        await database.update_sessao(sessao);
        setSessaoModified(false);
        mostrarNotificacao("Sessão atualizada com sucesso!", "success");
      }
    } catch (err) {
      console.error(err);
      mostrarNotificacao("Erro ao salvar sessão.", "error");
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin/sessoes")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {id === "novo" ? "Nova Sessão" : "Sessão"}
          </h2>
          {sessao?.assistido_nome && id !== "novo" && (
            <p className="text-sm text-neutral-600">
              {sessao.assistido_nome} - {sessao.horario}
            </p>
          )}
        </div>
        <button
          disabled={!sessaoModified && id !== "novo"}
          onClick={handleSave}
          className={`absolute top-0 right-0 p-2 transition-colors ${
            sessaoModified || id === "novo"
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
          <SeletorDeBotoes
            label="Dia"
            options={["ONTEM", "HOJE", "AMANHÃ"]}
            valorSelecionado={dataSelecionada}
            onChange={(data: string) => {
              setDataSelecionada(data);
              const dayOffset = data === "ONTEM" ? -1 : data === "HOJE" ? 0 : 1;
              setSessao({
                ...sessao,
                data: Util.iso_date(dayOffset),
                horario: "",
                terapia: "",
                assistido_id: "",
                assistido_situacao: "",
                assistido_nome: "",
                profissional_id: "",
                profissional_situacao: "",
                profissional_nome: "",
                apoio_id: "",
                apoio_situacao: "",
                apoio_nome: "",
              } as ISessao);
              setSessaoModified(true);
            }}
          />

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
              {sessao?.horario || "Selecione o horário..."}
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
              {sessao?.terapia || "Selecione a terapia..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Assistido
            </label>
            <button
              type="button"
              onClick={() => {
                if (sessao?.horario) {
                  setIsAssistidoDialogOpen(true);
                } else {
                  mostrarNotificacao(
                    "Por favor, selecione um horário antes de escolher o assistido.",
                  );
                }
              }}
              className={`p-2.5 rounded-lg border bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left ${
                sessao?.assistido_situacao === "INATIVO"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {sessao?.assistido_nome || "Selecione o assistido..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Profissional
            </label>
            <button
              type="button"
              onClick={() => {
                if (!sessao?.horario) {
                  mostrarNotificacao(
                    "Por favor, selecione um horário antes de escolher o profissional.",
                  );
                } else if (!sessao?.assistido_id) {
                  mostrarNotificacao(
                    "Por favor, selecione um assistido antes de escolher o profissional.",
                  );
                } else {
                  setIsProfissionalDialogOpen(true);
                }
              }}
              className={`p-2.5 rounded-lg border bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left ${
                sessao?.profissional_situacao === "INATIVO"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {sessao?.profissional_nome || "Selecione um profissional..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">
              Apoio
            </label>
            <button
              type="button"
              onClick={() => {
                if (!sessao?.horario) {
                  mostrarNotificacao(
                    "Por favor, selecione um horário antes de escolher o profissional.",
                  );
                } else if (!sessao?.assistido_id) {
                  mostrarNotificacao(
                    "Por favor, selecione um assistido antes de escolher o profissional.",
                  );
                } else {
                  setIsApoioDialogOpen(true);
                }
              }}
              className={`p-2.5 rounded-lg border bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left ${
                sessao?.apoio_situacao === "INATIVO"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {sessao?.apoio_nome || "Selecione um apoio (opcional)..."}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-600">Sala</label>
            <button
              type="button"
              onClick={() => setIsSalaDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {sessao?.sala ? `Sala ${sessao.sala}` : "Selecione a sala..."}
            </button>
          </div>

          <SeletorDeBotoes
            label="Status"
            options={status_options}
            valorSelecionado={sessao?.status || "PENDENTE"}
            onChange={(status) => {
              setSessao({ ...sessao, status } as ISessao);
              setSessaoModified(true);
            }}
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="observacoes"
              className="text-sm font-medium text-neutral-600"
            >
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              ref={observacoesInputRef}
              rows={4}
              placeholder="Observações sobre a sessão..."
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors resize-none"
              value={sessao?.observacoes || ""}
              onChange={(e) => {
                setSessao({
                  ...sessao,
                  observacoes: e.target.value,
                } as ISessao);
                setSessaoModified(true);
              }}
              onFocus={() => Util.handleFocus(observacoesInputRef)}
            />
          </div>
        </form>
      </div>

      <BottomDialog
        isOpen={isSalaDialogOpen}
        onClose={() => setIsSalaDialogOpen(false)}
        title="Selecione a Sala"
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-5 gap-2">
            {salas_options.map((sala) => {
              const salaOcupada = salasOcupadas.find(
                (s) =>
                  s.room === sala &&
                  s.date === sessao?.data &&
                  s.session_time === sessao?.horario,
              );
              const isOcupada = salaOcupada && salaOcupada.names.length > 0;

              return (
                <button
                  key={sala}
                  onClick={() => {
                    setSessao({ ...sessao, sala } as ISessao);
                    setSessaoModified(true);
                    setIsSalaDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border transition-all flex flex-col gap-1 ${
                    sessao?.sala === sala
                      ? "bg-blue-500 border-blue-500 text-white"
                      : isOcupada
                        ? "bg-blue-50 border-blue-300 text-neutral-700"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium">{sala}</span>
                  <span
                    className={`text-xs font-semibold ${
                      sessao?.sala === sala
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
          <div className="max-h-[300px] overflow-y-auto flex flex-col gap-2">
            {salasOcupadas
              .filter(
                (s) =>
                  s.date === sessao?.data &&
                  s.session_time === sessao?.horario &&
                  s.names.length > 0,
              )
              .map((sala) => (
                <div
                  key={sala.room}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-300"
                >
                  <p className="text-sm font-semibold text-blue-700 mb-1">
                    Sala {sala.room} - Ocupada
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
              setSessao({ ...sessao, sala: null } as ISessao);
              setSessaoModified(true);
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
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {terapia_optrions.map((terapia) => (
              <button
                key={terapia}
                onClick={() => {
                  setSessao({ ...sessao, terapia } as ISessao);
                  setSessaoModified(true);
                  setIsTerapiaDialogOpen(false);
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                  sessao?.terapia === terapia
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                }`}
              >
                {terapia}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              setSessao({ ...sessao, terapia: "" } as ISessao);
              setSessaoModified(true);
              setIsTerapiaDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isHorarioDialogOpen}
        onClose={() => setIsHorarioDialogOpen(false)}
        title="Selecione o Horário"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            <div>
              <h4 className="text-xs font-semibold text-neutral-600 mb-2">
                Manhã
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {horarios_options.manha.map((horario) => (
                  <button
                    key={horario}
                    onClick={() => {
                      setSessao({
                        ...sessao,
                        horario,
                        terapia: "",
                        assistido_id: "",
                        assistido_situacao: "",
                        assistido_nome: "",
                        profissional_id: "",
                        profissional_situacao: "",
                        profissional_nome: "",
                        apoio_id: "",
                        apoio_situacao: "",
                        apoio_nome: "",
                      } as ISessao);
                      setSessaoModified(true);
                      setIsHorarioDialogOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      sessao?.horario === horario
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-600 mb-2">
                Tarde
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {horarios_options.tarde.map((horario) => (
                  <button
                    key={horario}
                    onClick={() => {
                      setSessao({
                        ...sessao,
                        horario,
                        terapia: "",
                        assistido_id: "",
                        assistido_situacao: "",
                        assistido_nome: "",
                        profissional_id: "",
                        profissional_situacao: "",
                        profissional_nome: "",
                        apoio_id: "",
                        apoio_situacao: "",
                        apoio_nome: "",
                      } as ISessao);
                      setSessaoModified(true);
                      setIsHorarioDialogOpen(false);
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      sessao?.horario === horario
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    {horario}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setSessao({ ...sessao, horario: "" } as ISessao);
              setSessaoModified(true);
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
            <button
              type="button"
              onClick={() => setIsProfissionalPinned(!isProfissionalPinned)}
              className={`p-2.5 rounded-lg border transition-colors ${
                isProfissionalPinned
                  ? "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400 hover:text-neutral-800"
              }`}
              title={
                isProfissionalPinned
                  ? "Desafixar do assistido"
                  : "Fixar ao assistido"
              }
            >
              <Pin size={20} />
            </button>
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
                    setSessao({
                      ...sessao,
                      profissional_id: profissional.id,
                      profissional_nome: profissional.nome,
                      profissional_situacao: profissional.status,
                    } as ISessao);
                    setSessaoModified(true);
                    setIsProfissionalDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    sessao?.profissional_id === profissional.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  {profissional.nome}
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
              setSessao({
                ...sessao,
                profissional_id: "",
                profissional_nome: "",
                profissional_situacao: "",
              } as ISessao);
              setSessaoModified(true);
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
            <button
              type="button"
              onClick={() => setIsApoioPinned(!isApoioPinned)}
              className={`p-2.5 rounded-lg border transition-colors ${
                isApoioPinned
                  ? "bg-blue-50 border-blue-300 text-blue-600 hover:bg-blue-100"
                  : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400 hover:text-neutral-800"
              }`}
              title={
                isApoioPinned ? "Desafixar do assistido" : "Fixar ao assistido"
              }
            >
              <Pin size={20} />
            </button>
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
                    setSessao({
                      ...sessao,
                      apoio_id: apoio.id,
                      apoio_nome: apoio.nome,
                      apoio_situacao: apoio.status,
                    } as ISessao);
                    setSessaoModified(true);
                    setIsApoioDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    sessao?.apoio_id === apoio.id
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                  }`}
                >
                  {apoio.nome}
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
              setSessao({
                ...sessao,
                apoio_id: "",
                apoio_nome: "",
                apoio_situacao: "",
              } as ISessao);
              setSessaoModified(true);
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
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {assistidos.length > 0 ? (
              assistidos.map((assistido) => (
                <button
                  key={assistido.id}
                  onClick={() => {
                    setSessao({
                      ...sessao,
                      assistido_id: assistido.id,
                      assistido_nome: assistido.nome,
                      assistido_situacao: assistido.status,
                    } as ISessao);
                    setSessaoModified(true);
                    setIsAssistidoDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    sessao?.assistido_id === assistido.id
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
              setSessao({
                ...sessao,
                assistido_id: "",
                assistido_nome: "",
                assistido_situacao: "",
              } as ISessao);
              setSessaoModified(true);
              setIsAssistidoDialogOpen(false);
            }}
            className="flex-shrink-0 p-3 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-all text-center"
          >
            Limpar
          </button>
        </div>
      </BottomDialog>
    </div>
  );
}

export default SessaoForm;
