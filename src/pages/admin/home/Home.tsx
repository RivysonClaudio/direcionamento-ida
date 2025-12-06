import { LogOut, Calendar, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DirecionamentoAviso from "../../../components/DirecionamentoAviso.tsx";
import DatabaseService from "../../../services/database/DatabaseService.ts";
import Util from "../../../util/util.tsx";
import { useEffect, useState } from "react";
import type { IAssistido } from "../assistidos/IAssistido.tsx";
import type { IProfissional } from "../profissionais/IProfissional.tsx";
import type { ISessao } from "../sessoes/ISessao.tsx";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes.tsx";

function Home() {
  const navigate = useNavigate();

  const user = localStorage.getItem("user")?.split(" ")[0] || "User";
  const [assistidos, setAssistidos] = useState<IAssistido[]>([]);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [agendasCount, setAgendasCount] = useState<
    Array<{ week_day: number; session_time: string; count: number }>
  >([]);
  const [turno, setTurno] = useState<"MANHÃ" | "TARDE">("TARDE");

  useEffect(() => {
    const database = new DatabaseService();

    database
      .get_assistidos("", { status: "ATIVO" })
      .then((data) => setAssistidos(data));
    database.get_profissionais().then((data) => setProfissionais(data));
    database
      .get_all_agendas_count_by_week_day()
      .then((data) => setAgendasCount(data));

    database
      .get_sessoes_by_date(Util.iso_date(0))
      .then((data) => setSessoes(data));
  }, []);

  return (
    <div className="flex flex-col gap-4 w-screen h-dvh p-4 bg-(--yellow) overflow-auto">
      <div className="relative py-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-600">{Util.today_date()}</p>
          <h1 className="text-2xl font-bold text-neutral-800">Olá, {user}!</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          className="absolute top-0 right-0 p-2 text-neutral-600"
          title="Sair"
        >
          <LogOut size={24} />
        </button>
      </div>

      <DirecionamentoAviso />

      <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 shadow-sm p-3">
        <h3 className="text-sm font-semibold text-neutral-800">
          Agenda Semanal por Horário
        </h3>
        <SeletorDeBotoes
          options={["MANHÃ", "TARDE"]}
          valorSelecionado={turno}
          onChange={setTurno}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 font-medium text-neutral-600">
                  Horário
                </th>
                <th className="text-center py-2 px-2 font-medium text-neutral-600">
                  Seg
                </th>
                <th className="text-center py-2 px-2 font-medium text-neutral-600">
                  Ter
                </th>
                <th className="text-center py-2 px-2 font-medium text-neutral-600">
                  Qua
                </th>
                <th className="text-center py-2 px-2 font-medium text-neutral-600">
                  Qui
                </th>
                <th className="text-center py-2 px-2 font-medium text-neutral-600">
                  Sex
                </th>
              </tr>
            </thead>
            <tbody>
              {(turno === "MANHÃ"
                ? [
                    "08:15",
                    "09:00",
                    "09:45",
                    "10:30",
                    "11:15",
                    "12:00",
                    "12:45",
                  ]
                : [
                    "13:15",
                    "14:00",
                    "14:45",
                    "15:30",
                    "16:15",
                    "17:00",
                    "17:45",
                  ]
              ).map((horario) => (
                <tr key={horario} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-medium text-neutral-700">
                    {horario}
                  </td>
                  {[2, 3, 4, 5, 6].map((dia) => {
                    const item = agendasCount.find(
                      (a) => a.week_day === dia && a.session_time === horario
                    );
                    return (
                      <td
                        key={dia}
                        className="text-center py-2 px-2 text-neutral-600"
                      >
                        {item ? item.count : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="h-dvh"></div>

      <div className="grid grid-cols-3 gap-3">
        <div
          onClick={() => navigate("/admin/assistidos")}
          className="cursor-pointer shadow-md hover:shadow-lg transition-shadow flex flex-col gap-2 aspect-square justify-center items-center rounded-lg bg-white border border-gray-300"
        >
          <Users size={28} className="text-neutral-700" />
          <div className="text-center">
            <p className="text-xl font-bold text-neutral-800">
              {assistidos.length}
            </p>
            <p className="text-xs font-medium text-neutral-600">Assistidos</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/sessoes")}
          className="cursor-pointer shadow-md hover:shadow-lg transition-shadow flex flex-col gap-2 aspect-square justify-center items-center rounded-lg bg-white border border-gray-300"
        >
          <Calendar size={28} className="text-neutral-700" />
          <div className="text-center">
            <p className="text-xl font-bold text-neutral-800">
              {sessoes.length}
            </p>
            <p className="text-xs font-medium text-neutral-600">Sessões Hoje</p>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/profissionais")}
          className="cursor-pointer shadow-md hover:shadow-lg transition-shadow flex flex-col gap-2 aspect-square justify-center items-center rounded-lg bg-white border border-gray-300"
        >
          <Briefcase size={28} className="text-neutral-700" />
          <div className="text-center">
            <p className="text-xl font-bold text-neutral-800">
              {profissionais.length}
            </p>
            <p className="text-xs font-medium text-neutral-600">
              Profissionais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
