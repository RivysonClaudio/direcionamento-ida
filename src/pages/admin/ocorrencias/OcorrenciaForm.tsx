import { ChevronLeft, Save, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IOcorrencia } from "./IOcorrencia";
import type { IProfissional } from "../profissionais/IProfissional";
import DatabaseService from "../../../services/database/DatabaseService";
import { mostrarNotificacao } from "../../../util/notificacao";
import BottomDialog from "../../../components/BottomDialog";
import Util from "../../../util/util";

function OcorrenciaForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const database = DatabaseService.getInstance();

  const [ocorrencia, setOcorrencia] = useState<IOcorrencia | null>(null);
  const [ocorrenciaModified, setOcorrenciaModified] = useState(false);
  const [isTipoDialogOpen, setIsTipoDialogOpen] = useState(false);
  const [isProfissionalDialogOpen, setIsProfissionalDialogOpen] =
    useState(false);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [profissionalSearchTerm, setProfissionalSearchTerm] = useState("");
  const [selectedProfissionais, setSelectedProfissionais] = useState<string[]>(
    []
  );
  const profissionalSearchRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const tipo_options = [
    { label: "Falta", color: "bg-red-500" },
    { label: "Folga", color: "bg-blue-500" },
    { label: "Atraso", color: "bg-yellow-500" },
    { label: "Férias", color: "bg-pink-500" },
    { label: "Atestado", color: "bg-orange-500" },
    { label: "Feriado", color: "bg-gray-700" },
    { label: "Curso", color: "bg-black" },
    { label: "Clínica Faculdade", color: "bg-blue-900" },
    { label: "Sábado", color: "bg-blue-300" },
    { label: "Saiu da Instituição", color: "bg-gray-400" },
  ];

  useEffect(() => {
    if (id === "novo") {
      setOcorrencia({
        id: "",
        professional_id: null,
        type: "",
        from: "",
        to: "",
        description: null,
        batch_id: null,
        created_at: new Date().toISOString(),
        created_by: null,
        updated_at: null,
        updated_by: null,
        is_deleted: null,
      });
      setSelectedProfissionais([]);
    } else {
      database
        .get_ocorrencia_by_id(id!)
        .then((data) => {
          setOcorrencia(data);
          if (data.professional_id) {
            setSelectedProfissionais([data.professional_id]);
          } else {
            setSelectedProfissionais([]);
          }
        })
        .catch((err) => {
          console.error("Erro ao carregar ocorrência:", err);
          mostrarNotificacao("Erro ao carregar ocorrência.", "error");
          navigate("/admin/ocorrencias");
        });
    }
  }, [id, database]);

  useEffect(() => {
    // Carregar profissionais apenas quando o dialog for aberto
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
  }, [isProfissionalDialogOpen, profissionalSearchTerm, database]);

  const handleSave = async () => {
    if (!ocorrencia) return;

    if (!ocorrencia.type || ocorrencia.type.trim() === "") {
      mostrarNotificacao("O tipo de ocorrência é obrigatório.", "error");
      return;
    }

    if (!ocorrencia.from || ocorrencia.from.trim() === "") {
      mostrarNotificacao("A data de início é obrigatória.", "error");
      return;
    }

    if (!ocorrencia.to || ocorrencia.to.trim() === "") {
      mostrarNotificacao("A data de fim é obrigatória.", "error");
      return;
    }

    if (new Date(ocorrencia.from) > new Date(ocorrencia.to)) {
      mostrarNotificacao(
        "A data de início não pode ser maior que a data de fim.",
        "error"
      );
      return;
    }

    if (id === "novo") {
      // Criar múltiplas ocorrências se houver múltiplos profissionais selecionados
      const batch_id =
        selectedProfissionais.length > 1
          ? Util.generate_uuid()
          : ocorrencia.batch_id;

      const profissionaisToCreate =
        selectedProfissionais.length > 0 ? selectedProfissionais : [null];

      try {
        for (const profissionalId of profissionaisToCreate) {
          await database.create_ocorrencia({
            ...ocorrencia,
            professional_id: profissionalId,
            batch_id: batch_id,
          });
        }
        setOcorrenciaModified(false);
        mostrarNotificacao(
          `${profissionaisToCreate.length} ocorrência${
            profissionaisToCreate.length > 1 ? "s" : ""
          } cadastrada${
            profissionaisToCreate.length > 1 ? "s" : ""
          } com sucesso!`,
          "success"
        );
        navigate("/admin/ocorrencias");
      } catch (err) {
        console.error(err);
        mostrarNotificacao("Erro ao cadastrar ocorrência.", "error");
      }
    } else {
      await database
        .update_ocorrencia({
          ...ocorrencia,
          professional_id: selectedProfissionais[0] || null,
        })
        .then(() => {
          setOcorrenciaModified(false);
          mostrarNotificacao("Ocorrência atualizada com sucesso!", "success");
        })
        .catch((err) => {
          console.error(err);
          mostrarNotificacao("Erro ao atualizar ocorrência.", "error");
        });
    }
  };

  if (!ocorrencia) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full p-4 bg-(--yellow)">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/admin/ocorrencias")}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-neutral-800">
          {id === "novo" ? "Nova Ocorrência" : "Editar Ocorrência"}
        </h2>
        <button
          onClick={handleSave}
          disabled={!ocorrenciaModified}
          className={`absolute top-0 right-0 p-2 transition-colors ${
            ocorrenciaModified
              ? "text-blue-600 hover:text-blue-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Salvar"
        >
          <Save size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto bg-white rounded-lg border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Profissionais ({selectedProfissionais.length} selecionado
            {selectedProfissionais.length !== 1 ? "s" : ""})
          </label>
          <div
            onClick={() => setIsProfissionalDialogOpen(true)}
            className="py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-h-[42px] flex items-center"
          >
            {selectedProfissionais.length > 0 ? (
              <div className="flex flex-col gap-2 w-full">
                {selectedProfissionais.map((profId) => {
                  // Usar o nome da ocorrência ou procurar na lista de profissionais
                  const nome =
                    ocorrencia.professional_nome ||
                    profissionais.find((p) => p.id === profId)?.nome;

                  return nome ? (
                    <span
                      key={profId}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {nome}
                    </span>
                  ) : null;
                })}
              </div>
            ) : (
              <span className="text-neutral-400">
                Selecione um ou mais profissionais
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Tipo <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setIsTipoDialogOpen(true)}
            className="flex items-center gap-3 py-2 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {ocorrencia.type ? (
              <>
                <div
                  className={`w-6 h-6 rounded ${
                    tipo_options.find((t) => t.label === ocorrencia.type)?.color
                  }`}
                ></div>
                <span className="text-neutral-700">{ocorrencia.type}</span>
              </>
            ) : (
              <span className="text-neutral-400">Selecione um tipo</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Data de Início <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={ocorrencia.from}
            onChange={(e) => {
              setOcorrencia({ ...ocorrencia, from: e.target.value });
              setOcorrenciaModified(true);
            }}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Data de Fim <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={ocorrencia.to}
            onChange={(e) => {
              setOcorrencia({ ...ocorrencia, to: e.target.value });
              setOcorrenciaModified(true);
            }}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">
            Descrição
          </label>
          <textarea
            ref={descriptionRef}
            value={ocorrencia.description || ""}
            onChange={(e) => {
              setOcorrencia({ ...ocorrencia, description: e.target.value });
              setOcorrenciaModified(true);
            }}
            rows={4}
            placeholder="Digite uma descrição..."
            className="py-2 px-4 rounded-lg border border-gray-300 bg-white resize-none"
            onFocus={() => Util.handleFocus(descriptionRef)}
          />
        </div>
      </div>

      <BottomDialog
        isOpen={isTipoDialogOpen}
        onClose={() => setIsTipoDialogOpen(false)}
        title="Selecionar Tipo"
      >
        <div className="flex flex-col gap-2">
          {tipo_options.map((tipo) => (
            <button
              key={tipo.label}
              onClick={() => {
                setOcorrencia({ ...ocorrencia, type: tipo.label });
                setOcorrenciaModified(true);
                setIsTipoDialogOpen(false);
              }}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg border font-medium transition-colors ${
                ocorrencia.type === tipo.label
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`w-6 h-6 rounded ${tipo.color}`}></div>
              <span className="text-neutral-700">{tipo.label}</span>
            </button>
          ))}
        </div>
      </BottomDialog>

      <BottomDialog
        isOpen={isProfissionalDialogOpen}
        onClose={() => setIsProfissionalDialogOpen(false)}
        title="Selecionar Profissionais"
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
                setSelectedProfissionais([]);
                setOcorrenciaModified(true);
              }}
              className={`py-2 px-4 rounded-lg border text-sm transition-colors ${
                selectedProfissionais.length === 0
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              Nenhum
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto">
            {profissionais.length > 0 ? (
              profissionais.map((profissional) => {
                const isSelected = selectedProfissionais.includes(
                  profissional.id
                );
                return (
                  <button
                    key={profissional.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedProfissionais(
                          selectedProfissionais.filter(
                            (id) => id !== profissional.id
                          )
                        );
                      } else {
                        setSelectedProfissionais([
                          ...selectedProfissionais,
                          profissional.id,
                        ]);
                      }
                      setOcorrenciaModified(true);
                    }}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                      isSelected
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "bg-white border-gray-300 text-neutral-600 hover:border-gray-400"
                    }`}
                  >
                    {profissional.nome}
                  </button>
                );
              })
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

export default OcorrenciaForm;
