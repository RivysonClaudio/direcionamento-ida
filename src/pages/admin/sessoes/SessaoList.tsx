import {
  ChevronLeft,
  Filter,
  Calendar,
  AlertCircle,
  CalendarPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import { useState, useRef } from "react";
import SessaoCard from "./SessaoCard";
import DatabaseService from "../../../services/database/DatabaseService";
import type { ISessao } from "../sessoes/ISessao";
import type { IAssistido } from "../assistidos/IAssistido";
import type { IProfissional } from "../profissionais/IProfissional";
import { useEffect } from "react";
import Util from "../../../util/util";
import { mostrarNotificacao } from "../../../util/notificacao";
import BottomDialog from "../../../components/BottomDialog";
import { Search } from "lucide-react";

function SessaoList() {
  const navigate = useNavigate();
  const database = DatabaseService.getInstance();
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [sessoesPendentes, setSessoesPendentes] = useState<number>(0);
  const [selected, setSelected] = useState(
    localStorage.getItem("sessao_selectedDay") || "HOJE"
  );
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const options = ["ONTEM", "HOJE", "AMANHÃ"];
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [isHorarioDialogOpen, setIsHorarioDialogOpen] = useState(false);
  const [isTerapiaDialogOpen, setIsTerapiaDialogOpen] = useState(false);
  const [isSalaDialogOpen, setIsSalaDialogOpen] = useState(false);
  const [isAssistidoDialogOpen, setIsAssistidoDialogOpen] = useState(false);
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [assistidoSearchTerm, setAssistidoSearchTerm] = useState("");
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [profissionalSearchTerm, setProfissionalSearchTerm] = useState("");
  const [selectedAssistidoNome, setSelectedAssistidoNome] = useState(
    localStorage.getItem("sessao_filter_assistido_nome") || ""
  );
  const [selectedProfissionalNome, setSelectedProfissionalNome] = useState(
    localStorage.getItem("sessao_filter_profissional_nome") || ""
  );
  const assistidoSearchRef = useRef<HTMLInputElement>(null);
  const profissionalSearchRef = useRef<HTMLInputElement>(null);

  const horarios_options = {
    manha: ["07:15", "08:00", "08:45", "09:30", "10:15", "11:00", "11:45"],
    tarde: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"],
  };

  const terapia_options = [
    "ABA - Análise do Comport. Aplic.",
    "ABA - Análise do Comport. Aplic. (Extra)",
    "Outras terapias",
  ];

  const salas_options = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

  const [filter, setFilter] = useState(() => {
    const saved = localStorage.getItem("sessao_filter");
    return saved
      ? JSON.parse(saved)
      : {
          status: "",
          patient_id: "",
          profissional_id: "",
          therapy: "",
          session_time: "",
          sala: "",
        };
  });
  const [tempFilter, setTempFilter] = useState({
    status: "",
    patient_id: "",
    profissional_id: "",
    therapy: "",
    session_time: "",
    sala: "",
  });

  useEffect(() => {
    const dayOffset = selected === "ONTEM" ? -1 : selected === "AMANHÃ" ? 1 : 0;

    Promise.all([
      database.get_sessoes_by_date(Util.iso_date(dayOffset), filter),
      database.get_sessoes_pendentes_by_date(Util.iso_date(dayOffset)),
    ])
      .then(([sessoesData, pendentesData]) => {
        setSessoes(sessoesData);
        setSessoesPendentes(pendentesData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selected, refreshTrigger, filter]);

  useEffect(() => {
    if (!isAssistidoDialogOpen) return;

    if (!assistidoSearchTerm) {
      database
        .get_assistidos("")
        .then((data) => setAssistidos(data))
        .catch((err) => console.error(err));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_assistidos(assistidoSearchTerm)
        .then((data) => setAssistidos(data))
        .catch((err) => console.error(err));
    }, 350);

    return () => clearTimeout(timer);
  }, [isAssistidoDialogOpen, assistidoSearchTerm]);

  useEffect(() => {
    if (!isProfissionalDialogOpen) return;

    if (!profissionalSearchTerm) {
      database
        .get_profissionais("")
        .then((data) => setProfissionais(data))
        .catch((err) => console.error(err));
      return;
    }

    const timer = setTimeout(() => {
      database
        .get_profissionais(profissionalSearchTerm)
        .then((data) => setProfissionais(data))
        .catch((err) => console.error(err));
    }, 350);

    return () => clearTimeout(timer);
  }, [isProfissionalDialogOpen, profissionalSearchTerm]);

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {sessoes.length} Sess{sessoes.length !== 1 ? "ões" : "ão"}
          </h2>
        </div>
        <button
          onClick={() => {
            navigate("/admin/sessoes/novo");
          }}
          className="absolute top-0 right-0 p-2 text-neutral-600 hover:text-green-600 transition-colors"
          title="Novo Sessão"
        >
          <CalendarPlus size={24} />
        </button>
      </div>

      {sessoesPendentes > 0 && (
        <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in-out">
          <AlertCircle size={20} className="text-red-500" />
          <h2 className="text-sm font-medium text-red-700">
            {sessoesPendentes} Direcionamento
            {sessoesPendentes > 1 ? "s" : ""} pendente
            {sessoesPendentes > 1 ? "s" : ""}
          </h2>
        </div>
      )}

      <SeletorDeBotoes
        options={options}
        valorSelecionado={selected}
        onChange={(value) => {
          setSelected(value);
          localStorage.setItem("sessao_selectedDay", value);
        }}
      />

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm scrollbar-hidden">
        {sessoes.length > 0 ? (
          sessoes.map((sessao) => (
            <SessaoCard key={sessao.id} sessao={sessao} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <p className="text-center">Nenhuma sessão para este dia.</p>
          </div>
        )}
      </ul>

      <div className="flex gap-2">
        <button
          onClick={() => {
            const dayOffset =
              selected === "ONTEM" ? -1 : selected === "AMANHÃ" ? 1 : 0;
            database
              .dispatch_generat_sessao_job(
                Util.iso_date(dayOffset),
                Util.week_day + dayOffset
              )
              .then((response) => {
                mostrarNotificacao(
                  `${response} sessões criada(s) com sucesso.`,
                  "success"
                );
                setRefreshTrigger((prev) => prev + 1);
              })
              .catch((err) => {
                console.error(err);
                mostrarNotificacao("Erro ao gerar de sessões.", "error");
              });
          }}
          className="flex-1 flex py-3 justify-center items-center gap-2 rounded-lg bg-white border border-gray-300 text-neutral-700 font-medium hover:border-gray-400 transition-colors"
        >
          <Calendar size={20} />
          Gerar agenda
        </button>
        <button
          onClick={() => {
            setTempFilter(filter);
            setIsFilterDialogOpen(true);
          }}
          className={`p-3 rounded-lg border transition-colors ${
            filter.status ||
            filter.session_time ||
            filter.therapy ||
            filter.patient_id ||
            filter.profissional_id ||
            filter.sala
              ? "bg-blue-50 border-blue-500 text-blue-600"
              : "bg-white border-gray-300 text-neutral-600 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          <Filter size={20} />
        </button>
      </div>

      <BottomDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        title="Filtros"
      >
        <>
          <div className="flex flex-col gap-4 pb-20">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTempFilter({ ...tempFilter, status: "" })}
                  className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                    tempFilter.status === ""
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() =>
                    setTempFilter({ ...tempFilter, status: "PENDENTE" })
                  }
                  className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                    tempFilter.status === "PENDENTE"
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Pendente
                </button>
                <button
                  onClick={() =>
                    setTempFilter({ ...tempFilter, status: "AGENDADO" })
                  }
                  className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                    tempFilter.status === "AGENDADO"
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Agendado
                </button>
                <button
                  onClick={() =>
                    setTempFilter({ ...tempFilter, status: "CANCELADO" })
                  }
                  className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                    tempFilter.status === "CANCELADO"
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Cancelado
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Horário
              </label>
              <input
                type="text"
                readOnly
                value={tempFilter.session_time || "Todos"}
                onClick={() => setIsHorarioDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Terapia
              </label>
              <input
                type="text"
                readOnly
                value={tempFilter.therapy || "Todas"}
                onClick={() => setIsTerapiaDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Sala
              </label>
              <input
                type="text"
                readOnly
                value={tempFilter.sala || "Todas"}
                onClick={() => setIsSalaDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Assistido
              </label>
              <input
                type="text"
                readOnly
                value={
                  tempFilter.patient_id
                    ? selectedAssistidoNome || "Selecionado"
                    : "Todos"
                }
                onClick={() => setIsAssistidoDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-700">
                Profissional
              </label>
              <input
                type="text"
                readOnly
                value={
                  tempFilter.profissional_id
                    ? selectedProfissionalNome || "Selecionado"
                    : "Todos"
                }
                onClick={() => setIsProfissionalDialogOpen(true)}
                className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex gap-2 p-4 bg-white border-t border-gray-200">
            <button
              onClick={() => {
                const defaultFilter = {
                  status: "",
                  patient_id: "",
                  profissional_id: "",
                  therapy: "",
                  session_time: "",
                  sala: "",
                };
                setTempFilter(defaultFilter);
                setFilter(defaultFilter);
                setSelectedAssistidoNome("");
                setSelectedProfissionalNome("");
                localStorage.setItem(
                  "sessao_filter",
                  JSON.stringify(defaultFilter)
                );
                localStorage.removeItem("sessao_filter_assistido_nome");
                localStorage.removeItem("sessao_filter_profissional_nome");
                setIsFilterDialogOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-gray-200 text-neutral-700 font-medium hover:bg-gray-300 transition-colors"
            >
              Limpar
            </button>
            <button
              onClick={() => {
                setFilter(tempFilter);
                localStorage.setItem(
                  "sessao_filter",
                  JSON.stringify(tempFilter)
                );
                setIsFilterDialogOpen(false);
              }}
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </>
      </BottomDialog>

      <BottomDialog
        isOpen={isHorarioDialogOpen}
        onClose={() => setIsHorarioDialogOpen(false)}
        title="Selecionar Horário"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setTempFilter({ ...tempFilter, session_time: "" });
                setIsHorarioDialogOpen(false);
              }}
              className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                tempFilter.session_time === ""
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-neutral-700">Manhã</h3>
            <div className="grid grid-cols-4 gap-2">
              {horarios_options.manha.map((horario) => (
                <button
                  key={horario}
                  onClick={() => {
                    setTempFilter({
                      ...tempFilter,
                      session_time:
                        tempFilter.session_time === horario ? "" : horario,
                    });
                    setIsHorarioDialogOpen(false);
                  }}
                  className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                    tempFilter.session_time === horario
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {horario}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-neutral-700">Tarde</h3>
            <div className="grid grid-cols-4 gap-2">
              {horarios_options.tarde.map((horario) => (
                <button
                  key={horario}
                  onClick={() => {
                    setTempFilter({
                      ...tempFilter,
                      session_time:
                        tempFilter.session_time === horario ? "" : horario,
                    });
                    setIsHorarioDialogOpen(false);
                  }}
                  className={`py-2 px-3 rounded-lg border text-sm transition-colors ${
                    tempFilter.session_time === horario
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {horario}
                </button>
              ))}
            </div>
          </div>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isTerapiaDialogOpen}
        onClose={() => setIsTerapiaDialogOpen(false)}
        title="Selecionar Terapia"
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setTempFilter({ ...tempFilter, therapy: "" });
              setIsTerapiaDialogOpen(false);
            }}
            className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
              tempFilter.therapy === ""
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            Todas
          </button>
          {terapia_options.map((terapia) => (
            <button
              key={terapia}
              onClick={() => {
                setTempFilter({
                  ...tempFilter,
                  therapy: tempFilter.therapy === terapia ? "" : terapia,
                });
                setIsTerapiaDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                tempFilter.therapy === terapia
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
        isOpen={isSalaDialogOpen}
        onClose={() => setIsSalaDialogOpen(false)}
        title="Selecionar Sala"
      >
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setTempFilter({ ...tempFilter, sala: "" });
              setIsSalaDialogOpen(false);
            }}
            className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
              tempFilter.sala === ""
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            Todas
          </button>
          <div className="grid grid-cols-5 gap-2">
            {salas_options.map((sala) => (
              <button
                key={sala}
                onClick={() => {
                  setTempFilter({
                    ...tempFilter,
                    sala: tempFilter.sala === String(sala) ? "" : String(sala),
                  });
                  setIsSalaDialogOpen(false);
                }}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  tempFilter.sala === String(sala)
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {sala}
              </button>
            ))}
          </div>
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isAssistidoDialogOpen}
        onClose={() => setIsAssistidoDialogOpen(false)}
        title="Selecionar Assistido"
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              ref={assistidoSearchRef}
              type="text"
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={assistidoSearchTerm}
              onChange={(e) => setAssistidoSearchTerm(e.target.value)}
              onFocus={() => Util.handleFocus(assistidoSearchRef)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setTempFilter({ ...tempFilter, patient_id: "" });
                setSelectedAssistidoNome("");
                localStorage.removeItem("sessao_filter_assistido_nome");
                setIsAssistidoDialogOpen(false);
              }}
              className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                tempFilter.patient_id === ""
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {assistidos.length > 0 ? (
              assistidos.map((assistido) => (
                <button
                  key={assistido.id}
                  onClick={() => {
                    setTempFilter({
                      ...tempFilter,
                      patient_id:
                        tempFilter.patient_id === assistido.id
                          ? ""
                          : assistido.id,
                    });
                    const newNome =
                      tempFilter.patient_id === assistido.id
                        ? ""
                        : assistido.nome;
                    setSelectedAssistidoNome(newNome);
                    if (newNome) {
                      localStorage.setItem(
                        "sessao_filter_assistido_nome",
                        newNome
                      );
                    } else {
                      localStorage.removeItem("sessao_filter_assistido_nome");
                    }
                    setIsAssistidoDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    tempFilter.patient_id === assistido.id
                      ? "bg-blue-500 border-blue-500 text-white"
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
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isProfissionalDialogOpen}
        onClose={() => setIsProfissionalDialogOpen(false)}
        title="Selecionar Profissional"
      >
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={20}
            />
            <input
              ref={profissionalSearchRef}
              type="text"
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-300 text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={profissionalSearchTerm}
              onChange={(e) => setProfissionalSearchTerm(e.target.value)}
              onFocus={() => Util.handleFocus(profissionalSearchRef)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setTempFilter({ ...tempFilter, profissional_id: "" });
                setSelectedProfissionalNome("");
                localStorage.removeItem("sessao_filter_profissional_nome");
                setIsProfissionalDialogOpen(false);
              }}
              className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                tempFilter.profissional_id === ""
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Todos
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {profissionais.length > 0 ? (
              profissionais.map((profissional) => (
                <button
                  key={profissional.id}
                  onClick={() => {
                    setTempFilter({
                      ...tempFilter,
                      profissional_id:
                        tempFilter.profissional_id === profissional.id
                          ? ""
                          : profissional.id,
                    });
                    const newNome =
                      tempFilter.profissional_id === profissional.id
                        ? ""
                        : profissional.nome;
                    setSelectedProfissionalNome(newNome);
                    if (newNome) {
                      localStorage.setItem(
                        "sessao_filter_profissional_nome",
                        newNome
                      );
                    } else {
                      localStorage.removeItem(
                        "sessao_filter_profissional_nome"
                      );
                    }
                    setIsProfissionalDialogOpen(false);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    tempFilter.profissional_id === profissional.id
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
        </div>
      </BottomDialog>
    </div>
  );
}

export default SessaoList;
