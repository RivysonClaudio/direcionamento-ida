import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import DatabaseService from "../../services/database/DatabaseService.ts";
import Util from "../../util/util.tsx";
import type { ISessao } from "../admin/sessoes/ISessao.tsx";
import SeletorDeBotoes from "../../components/SeletorDeBotoes.tsx";
import { useParams } from "react-router-dom";
import SessaoCard from "./SessaoCard.tsx";
import SessaoDetalhes from "./SessaoDetalhes.tsx";

type DataOption = "ONTEM" | "HOJE" | "AMANHÃ";

function Agenda() {
  const database = new DatabaseService();

  const { id } = useParams<{ id: string }>();

  const user = localStorage.getItem("user")?.split(" ")[0] || "User";

  const [dataSelecionada, setDataSelecionada] = useState<DataOption>("HOJE");
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<ISessao | null>(
    null
  );
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);

  const getDataOffset = (opcao: DataOption): number => {
    switch (opcao) {
      case "ONTEM":
        return -1;
      case "HOJE":
        return 0;
      case "AMANHÃ":
        return 1;
    }
  };

  useEffect(() => {
    const offset = getDataOffset(dataSelecionada);
    const data = Util.iso_date(offset);

    database
      .get_sessoes_by_date(data, { status: "AGENDADO", profissional_id: id })
      .then((data) => {
        setSessoes(data);
      });
  }, [dataSelecionada]);

  return (
    <div className="flex flex-col h-full bg-(--blue)">
      <div className="flex-shrink-0 p-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 text-center">
            <p className="text-sm text-neutral-600">{Util.today_date()}</p>
            <h1 className="text-xl font-bold text-neutral-800">Olá, {user}!</h1>
          </div>
        </div>

        <SeletorDeBotoes<DataOption>
          label="Confira a sua agenda para:"
          options={["ONTEM", "HOJE", "AMANHÃ"]}
          valorSelecionado={dataSelecionada}
          onChange={setDataSelecionada}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-2">
        {sessoes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sessoes
              .sort((a, b) => a.horario.localeCompare(b.horario))
              .map((sessao) => (
                <div key={sessao.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-neutral-600" />
                    <h3 className="text-sm font-semibold text-neutral-700">
                      {sessao.horario}
                    </h3>
                  </div>
                  <SessaoCard
                    sessao={sessao}
                    onClick={() => {
                      setSessaoSelecionada(sessao);
                      setIsDetalhesOpen(true);
                    }}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Calendar size={48} className="text-neutral-400 mb-2" />
            <p className="text-neutral-500 text-center">
              Nenhuma sessão encontrada para esta data
            </p>
          </div>
        )}
      </div>

      <SessaoDetalhes
        sessao={sessaoSelecionada}
        isOpen={isDetalhesOpen}
        onClose={() => {
          setIsDetalhesOpen(false);
          setSessaoSelecionada(null);
        }}
      />
    </div>
  );
}

export default Agenda;
