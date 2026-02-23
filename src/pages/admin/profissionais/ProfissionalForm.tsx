import { ChevronLeft, Save } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IProfissional } from "./IProfissional";
import DatabaseService from "../../../services/database/DatabaseService";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import type { IAgenda } from "../agendas/IAgenda";
import BottomDialog from "../../../components/BottomDialog";
import { mostrarNotificacao } from "../../../util/notificacao";
import Util from "../../../util/util";

function ProfissionalForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [profissional, setProfissional] = useState<IProfissional | null>(null);
  const [profissionalModified, setProfissionalModified] = useState(false);
  const [statusChanged, setStatusChanged] = useState(false);
  const [agendaResumo, setAgendaResumo] = useState<IAgenda[]>([]);
  const observacoesRef = useRef<HTMLTextAreaElement>(null);
  const [isFuncaoDialogOpen, setIsFuncaoDialogOpen] = useState(false);

  const status_options = ["ATIVO", "INATIVO"];
  const turno_options = ["MANHA", "TARDE"];
  const funcoes_options = [
    "Aplicador - ABA",
    "Aux. Coord. - ABA",
    "Coordenador - ABA",
  ];

  const dias_da_semana = [2, 3, 4, 5, 6];
  const dias_da_semana_nomes: Record<number, string> = {
    2: "Seg",
    3: "Ter",
    4: "Qua",
    5: "Qui",
    6: "Sex",
  };
  const turnos_horarios = {
    MANHA: ["07:15", "08:00", "08:45", "09:30", "10:15", "11:00", "11:45"],
    TARDE: ["13:15", "14:00", "14:45", "15:30", "16:15", "17:00", "17:45"],
  };

  const database = DatabaseService.getInstance();

  useEffect(() => {
    if (id && id !== "novo") {
      database
        .get_profissional_by_id(id)
        .then((data) => {
          setProfissional(data);
        })
        .catch((err) => console.error(err));

      database
        .get_agenda_by_id("professional_id", id)
        .then((data) => {
          setAgendaResumo(data);
        })
        .catch((err) => console.error(err));
    } else {
      setProfissional({
        id: "",
        nome: "",
        turno: "TARDE",
        funcao: "",
        status: "ATIVO",
        role: "MEMBER",
        observacoes: "",
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!profissional) return;

    if (id === "novo") {
      if (profissional.nome.trim() === "") {
        return mostrarNotificacao("O nome é obrigatório.", "error");
      }

      await database
        .create_profissional(profissional)
        .then(() => {
          setProfissionalModified(false);
          mostrarNotificacao("Profissional criado com sucesso!", "success");
          navigate("/admin/profissionais");
        })
        .catch((err) => {
          console.error(err);
          mostrarNotificacao("Erro ao criar profissional.", "error");
        });
    } else {
      await database
        .update_profissional(profissional)
        .then(async () => {
          setProfissionalModified(false);
          mostrarNotificacao("Profissional atualizado com sucesso!", "success");
          if (statusChanged && profissional.status === "INATIVO") {
            database
              .update_sessions_on_professional_status_change(
                profissional.id,
                "2025-12-05",
              )
              .then(() => {
                mostrarNotificacao(
                  "Sessões atualizadas conforme mudança de status.",
                  "success",
                );
              })
              .catch((err) => {
                console.error(err);
                mostrarNotificacao(
                  "Erro ao atualizar sessões após mudança de status.",
                  "error",
                );
              });
          }
        })
        .catch((err) => {
          console.error(err);
          mostrarNotificacao("Erro ao atualizar profissional.", "error");
        });
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin/profissionais")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {id === "novo" ? "Novo Profissional" : "Profissional"}
          </h2>
          {profissional?.nome && id !== "novo" && (
            <p className="text-sm text-neutral-600">{profissional.nome}</p>
          )}
        </div>
        <button
          disabled={!profissionalModified && id !== "novo"}
          onClick={handleSave}
          className={`absolute top-0 right-0 p-2 transition-colors ${
            profissionalModified || id === "novo"
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
            <label
              htmlFor="nome"
              className="text-sm font-medium text-neutral-600"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={profissional?.nome || ""}
              onChange={(e) => {
                setProfissional({
                  ...profissional,
                  nome: e.target.value,
                } as IProfissional);
                setProfissionalModified(true);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="funcao"
              className="text-sm font-medium text-neutral-600"
            >
              Função
            </label>
            <button
              type="button"
              onClick={() => setIsFuncaoDialogOpen(true)}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left"
            >
              {profissional?.funcao || "Selecione uma função..."}
            </button>
          </div>

          <SeletorDeBotoes
            label="Situação"
            options={status_options}
            valorSelecionado={profissional?.status || "ATIVO"}
            onChange={(status) => {
              setProfissional({ ...profissional, status } as IProfissional);
              setProfissionalModified(true);
              setStatusChanged(true);
            }}
          />

          <SeletorDeBotoes
            label="Turno"
            options={turno_options}
            valorSelecionado={profissional?.turno || "TARDE"}
            onChange={(turno) => {
              setProfissional({ ...profissional, turno } as IProfissional);
              setProfissionalModified(true);
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
              ref={observacoesRef}
              id="observacoes"
              name="observacoes"
              rows={4}
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors resize-none"
              placeholder="Observações sobre o profissional..."
              value={profissional?.observacoes || ""}
              onFocus={() => Util.handleFocus(observacoesRef)}
              onChange={(e) => {
                setProfissional({
                  ...profissional,
                  observacoes: e.target.value,
                } as IProfissional);
                setProfissionalModified(true);
              }}
            />
          </div>
        </form>

        {id !== "novo" && profissional?.turno && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-600">
              Resumo da Agenda
            </label>
            <div
              onClick={() => {
                if (profissional?.id == null || profissional.id === "")
                  return mostrarNotificacao(
                    "É necessário salvar o profissional antes de acessar a agenda.",
                    "error"
                  );
                navigate(`/admin/profissionais/${profissional?.id}/agenda`);
              }}
              className="cursor-pointer p-2 bg-gray-50 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <ul className="grid grid-cols-5 gap-1 text-center text-xs">
                {dias_da_semana.map((dia, index) => (
                  <li
                    key={index}
                    className="font-semibold text-neutral-700 bg-yellow-100 p-2 rounded"
                  >
                    {dias_da_semana_nomes[dia]}
                  </li>
                ))}
                {turnos_horarios[profissional.turno as "MANHA" | "TARDE"].map(
                  (horario, index) => (
                    <Fragment key={index}>
                      {dias_da_semana.map((_, diaIndex) => (
                        <li
                          key={`${index}-${diaIndex}`}
                          className={`${
                            agendaResumo.some(
                              (agenda: IAgenda) =>
                                agenda.horario === horario &&
                                agenda.dia_semana === dias_da_semana[diaIndex],
                            )
                              ? "bg-(--blue) text-white font-semibold"
                              : "bg-gray-200 text-neutral-500"
                          } p-2 rounded`}
                        >
                          {horario}
                        </li>
                      ))}
                    </Fragment>
                  ),
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      <BottomDialog
        isOpen={isFuncaoDialogOpen}
        onClose={() => setIsFuncaoDialogOpen(false)}
        title="Selecione a Função"
      >
        <div className="flex flex-col gap-2">
          {funcoes_options.map((funcao, index) => (
            <button
              key={index}
              onClick={() => {
                setProfissional({ ...profissional, funcao } as IProfissional);
                setProfissionalModified(true);
                setIsFuncaoDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-left transition-colors ${
                profissional?.funcao === funcao
                  ? "border-blue-500 bg-blue-50 text-blue-700 font-medium"
                  : "border-gray-300 bg-white text-neutral-700 hover:bg-gray-50"
              }`}
            >
              {funcao}
            </button>
          ))}
        </div>
      </BottomDialog>
    </div>
  );
}

export default ProfissionalForm;
