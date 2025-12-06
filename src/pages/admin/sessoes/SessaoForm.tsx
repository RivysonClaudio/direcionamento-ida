import { ChevronLeft, Save } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ISessao } from "./ISessao";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import BottomDialog from "../../../components/BottomDialog";
import Util from "../../../util/util";

function SessaoForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [sessaoModified, setSessaoModified] = useState(false);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [isApoioDialogOpen, setIsApoioDialogOpen] = useState(false);
  const [isHorarioDialogOpen, setIsHorarioDialogOpen] = useState(false);
  const [isTerapiaDialogOpen, setIsTerapiaDialogOpen] = useState(false);
  const [isAssistidoDialogOpen, setIsAssistidoDialogOpen] = useState(false);

  const dataInputRef = useRef<HTMLInputElement>(null);
  const observacoesInputRef = useRef<HTMLTextAreaElement>(null);

  const status_options: Array<"PENDENTE" | "AGENDADO" | "CANCELADO"> = [
    "PENDENTE",
    "AGENDADO",
    "CANCELADO",
  ];

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

  const terapia_optrions = [
    "ABA - Análise do Comport. Aplic.",
    "Outras terapias",
  ];

  useEffect(() => {
    const database = new DatabaseService();

    if (id && id !== "novo") {
      database
        .get_sessao_by_id(id)
        .then((data) => {
          setSessao(data);
        })
        .catch((err) => console.error(err));
    } else {
      // Nova sessão
      setSessao({
        id: "",
        data: "",
        status: "PENDENTE",
        terapia: "",
        horario: "",
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

    const database = new DatabaseService();

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
    <div className="flex flex-col gap-3 w-screen h-dvh p-4 bg-(--yellow)">
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
          <div className="flex flex-col gap-1">
            <label
              htmlFor="data"
              className="text-sm font-medium text-neutral-600"
            >
              Data
            </label>
            <input
              type="date"
              id="data"
              name="data"
              ref={dataInputRef}
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-neutral-700 outline-none focus:border-gray-400 transition-colors"
              value={sessao?.data || ""}
              onChange={(e) => {
                setSessao({ ...sessao, data: e.target.value } as ISessao);
                setSessaoModified(true);
              }}
              onFocus={() => Util.handleFocus(dataInputRef)}
            />
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
              onClick={() => setIsAssistidoDialogOpen(true)}
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
              onClick={() => setIsProfissionalDialogOpen(true)}
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
              onClick={() => setIsApoioDialogOpen(true)}
              className={`p-2.5 rounded-lg border bg-white text-neutral-700 outline-none hover:border-gray-400 transition-colors text-left ${
                sessao?.apoio_situacao === "INATIVO"
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              {sessao?.apoio_nome || "Selecione um apoio (opcional)..."}
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
        isOpen={isTerapiaDialogOpen}
        onClose={() => setIsTerapiaDialogOpen(false)}
        title="Selecione a Terapia"
      >
        <div className="flex flex-col gap-2">
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
                setSessao({ ...sessao, horario } as ISessao);
                setSessaoModified(true);
                setIsHorarioDialogOpen(false);
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                sessao?.horario === horario
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

export default SessaoForm;
