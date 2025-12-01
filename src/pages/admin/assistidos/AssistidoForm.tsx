import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IAssistido } from "./IAssistido";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";

function AssistidoForm() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [assistido, setAssistido] = useState<IAssistido | null>(null);

  const status_options = ["ATIVO", "INATIVO"];
  const turno_options = ["MANHA", "TARDE"];
  const nivel_suporte_options = ["I", "II", "III"];
  const precisa_apoio_options = ["SIM", "NAO"];

  const [assistidoModified, setAssistidoModified] = useState(false);

  const database = new DatabaseService();

  useEffect(() => {
    database
      .get_assistido_by_id(id!)
      .then((data) => {
        setAssistido(data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-2 bg-(--yellow)">
      <div className="relative py-1 flex items-center justify-center">
        <ChevronLeft
          onClick={() => navigate("/admin/assistidos")}
          className="absolute top-0 left-0 text-neutral-600 h-full"
        />
        <h2 className="text-center">Assistido</h2>
      </div>
      <div className="h-full p-2 flex flex-col gap-4 bg-(--yellow) rounded-md">
        <form action="javascript:void(0)" className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="nome" className="font-medium text-neutral-400">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              autoComplete="off"
              className="p-1 rounded-md border border-gray-300 bg-white text-center"
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
          <div className="flex flex-col">
            <label htmlFor="idade" className="font-medium text-neutral-400">
              Idade
            </label>
            <input
              type="text"
              id="idade"
              name="idade"
              autoComplete="off"
              className="p-1 rounded-md border border-gray-300 bg-white text-center"
              value={assistido?.idade}
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
      </div>
      <div>
        <button
          disabled={!assistidoModified}
          className={`w-full flex py-2 justify-center items-center rounded-md ${
            assistidoModified
              ? "bg-(--green) text-neutral-900"
              : "bg-gray-200 text-gray-400"
          }`}
          onClick={async () => {
            if (assistido) {
              await database
                .update_assistido(assistido)
                .then(() => {
                  setAssistidoModified(false);
                  mostrarNotificacao(
                    "Assistido atualizado com sucesso!",
                    "success"
                  );
                })
                .catch((err) => {
                  console.error(err);
                  mostrarNotificacao("Erro ao atualizar assistido.", "error");
                });
            }
          }}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

export default AssistidoForm;
