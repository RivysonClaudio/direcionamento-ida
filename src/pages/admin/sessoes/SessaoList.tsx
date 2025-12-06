import {
  ChevronLeft,
  Filter,
  Calendar,
  AlertCircle,
  CalendarPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";
import { useState } from "react";
import SessaoCard from "./SessaoCard";
import DatabaseService from "../../../services/database/DatabaseService";
import type { ISessao } from "../sessoes/ISessao";
import { useEffect } from "react";
import Util from "../../../util/util";
import { mostrarNotificacao } from "../../../util/notificacao";

function SessaoList() {
  const navigate = useNavigate();
  const database = new DatabaseService();
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [sessoesPendentes, setSessoesPendentes] = useState<ISessao[]>([]);
  const [selected, setSelected] = useState("HOJE");
  const options = ["ONTEM", "HOJE", "AMANHÃ"];

  useEffect(() => {
    const dayOffset = selected === "ONTEM" ? -1 : selected === "AMANHÃ" ? 1 : 0;

    database.get_sessoes_by_date(Util.iso_date(dayOffset)).then((data) => {
      setSessoes(data);

      setTimeout(() => {
        database
          .get_sessoes_pendentes_by_date(Util.iso_date(dayOffset))
          .then((data) => setSessoesPendentes(data));
      }, 300);
    });
  }, [selected]);

  return (
    <div className="flex flex-col gap-3 w-screen h-dvh p-4 bg-(--yellow)">
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

      {sessoesPendentes.length > 0 && (
        <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in-out">
          <AlertCircle size={20} className="text-red-500" />
          <h2 className="text-sm font-medium text-red-700">
            {sessoesPendentes.length} Direcionamento
            {sessoesPendentes.length > 1 ? "s" : ""} pendente
            {sessoesPendentes.length > 1 ? "s" : ""}
          </h2>
        </div>
      )}

      <SeletorDeBotoes
        options={options}
        valorSelecionado={selected}
        onChange={setSelected}
      />

      <ul className="h-full p-2 flex flex-col gap-3 overflow-y-auto rounded-lg bg-white border border-gray-200 shadow-sm">
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
                Util.week_day
              )
              .then((response) => {
                mostrarNotificacao(
                  `${response} sessões criada com sucesso.`,
                  "success"
                );
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
        <button className="bg-white border border-gray-300 p-3 text-neutral-600 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
}

export default SessaoList;
