import { ChevronLeft, Save } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IAssistido } from "./IAssistido";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import type { IAgenda } from "../agendas/IAgenda";

function AssistidoForm() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [assistido, setAssistido] = useState<IAssistido | null>(null);

  const [agendaResumo, setAgendaResumo] = useState<IAgenda[]>([]);

  const status_options = ["ATIVO", "INATIVO"];
  const turno_options = ["MANHA", "TARDE"];
  const nivel_suporte_options = ["I", "II", "III"];
  const precisa_apoio_options = ["SIM", "NAO"];
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

  const [assistidoModified, setAssistidoModified] = useState(false);

  const database = DatabaseService.getInstance();

  useEffect(() => {
    if (id === "novo") {
      setAssistido({
        id: "",
        nome: "",
        idade: null,
        status: "ATIVO",
        turno: null,
        nivel_suporte: null,
        precisa_apoio: null,
        med_id: null,
      } as IAssistido);
    } else {
      database
        .get_assistido_by_id(id!)
        .then((data) => {
          setAssistido(data);
        })
        .catch((err) => console.error(err));

      database
        .get_agenda_by_id("patient_id", id!)
        .then((data) => {
          setAgendaResumo(data);
        })
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleSave = async () => {
    if (!assistido) return;

    if (id === "novo") {
      if (assistido.nome.trim() === "") {
        mostrarNotificacao("O nome do assistido é obrigatório.", "error");
        return;
      }

      await database
        .create_assistido(assistido)
        .then(() => {
          setAssistidoModified(false);
          mostrarNotificacao("Assistido cadastrado com sucesso!", "success");
          navigate("/admin/assistidos");
        })
        .catch((err) => {
          console.error(err);
          mostrarNotificacao("Erro ao cadastrar assistido.", "error");
        });
    } else {
      await database
        .update_assistido(assistido)
        .then(() => {
          setAssistidoModified(false);
          mostrarNotificacao("Assistido atualizado com sucesso!", "success");
        })
        .catch((err) => {
          console.error(err);
          mostrarNotificacao("Erro ao atualizar assistido.", "error");
        });
    }
  };

  return (
    <div className="flex flex-col gap-3 h-full p-4">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate("/admin/assistidos")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            {id === "novo" ? "Novo Assistido" : "Assistido"}
          </h2>
          {assistido?.nome && id !== "novo" && (
            <p className="text-sm text-neutral-600">{assistido.nome}</p>
          )}
        </div>
        <button
          disabled={!assistidoModified}
          onClick={handleSave}
          className={`absolute top-0 right-0 p-2 transition-colors ${
            assistidoModified
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
              autoComplete="off"
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={assistido?.nome}
              onChange={(e) => {
                setAssistido({
                  ...assistido,
                  nome: e.target.value,
                } as IAssistido);
                setAssistidoModified(true);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="idade"
              className="text-sm font-medium text-neutral-600"
            >
              Idade
            </label>
            <input
              type="number"
              id="idade"
              name="idade"
              autoComplete="off"
              className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={assistido?.idade ?? ""}
              onChange={(e) => {
                setAssistido({
                  ...assistido,
                  idade: Number(e.target.value),
                } as IAssistido);
                setAssistidoModified(true);
              }}
            />
          </div>
          <SeletorDeBotoes
            label="Situação"
            options={status_options}
            valorSelecionado={assistido?.status || ""}
            onChange={(status) => {
              setAssistido({ ...assistido, status } as IAssistido);
              setAssistidoModified(true);
            }}
          />
          <SeletorDeBotoes
            label="Turno"
            options={turno_options}
            valorSelecionado={assistido?.turno || ""}
            onChange={(turno) => {
              setAssistido({ ...assistido, turno } as IAssistido);
              setAssistidoModified(true);
            }}
          />
          <SeletorDeBotoes
            label="Nível de Suporte"
            options={nivel_suporte_options}
            valorSelecionado={assistido?.nivel_suporte || ""}
            onChange={(nivel_suporte) => {
              setAssistido({ ...assistido, nivel_suporte } as IAssistido);
              setAssistidoModified(true);
            }}
          />
          <SeletorDeBotoes
            label="Precisa de Apoio ?"
            options={precisa_apoio_options}
            valorSelecionado={assistido?.precisa_apoio ? "SIM" : "NAO"}
            onChange={(option) => {
              setAssistido({
                ...assistido,
                precisa_apoio: option === "SIM",
              } as IAssistido);
              setAssistidoModified(true);
            }}
          />
        </form>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-600">
            Resumo da Agenda
          </label>
          {assistido?.turno ? (
            <div
              onClick={() => {
                if (assistido?.id == null || assistido.id === "")
                  return mostrarNotificacao(
                    "É necessário salvar o assistido antes de acessar a agenda.",
                    "error"
                  );
                navigate(`/admin/assistidos/${assistido?.id}/agenda`);
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
                {turnos_horarios[assistido.turno as "MANHA" | "TARDE"].map(
                  (horario, index) => (
                    <Fragment key={index}>
                      {dias_da_semana.map((_, diaIndex) => (
                        <li
                          key={`${index}-${diaIndex}`}
                          className={`${
                            agendaResumo.some(
                              (agenda: IAgenda) =>
                                agenda.horario === horario &&
                                agenda.dia_semana === dias_da_semana[diaIndex]
                            )
                              ? "bg-(--blue) text-white font-semibold"
                              : "bg-gray-200 text-neutral-500"
                          } p-2 rounded`}
                        >
                          {horario}
                        </li>
                      ))}
                    </Fragment>
                  )
                )}
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-300 text-center text-neutral-400">
              Carregando agenda...
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="med_id"
            className="text-sm font-medium text-neutral-600"
          >
            Med Therapy ID
          </label>
          <input
            type="text"
            id="med_id"
            name="med_id"
            autoComplete="off"
            className="p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
            value={assistido?.med_id ?? ""}
            onChange={(e) => {
              setAssistido({
                ...assistido,
                med_id: parseInt(e.target.value, 10) || null,
              } as IAssistido);
              setAssistidoModified(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AssistidoForm;
