import DatabaseService from "../../../services/database/DatabaseService.ts";
import Util from "../../../util/util.tsx";
import { useEffect, useState } from "react";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes.tsx";

function Home() {
  const user = localStorage.getItem("user")?.split(" ")[0] || "User";
  const [agendasCount, setAgendasCount] = useState<
    Array<{ week_day: number; session_time: string; count: number }>
  >([]);
  const [turno, setTurno] = useState<"MANHÃ" | "TARDE">("TARDE");

  useEffect(() => {
    const database = new DatabaseService();

    database
      .get_all_agendas_count_by_week_day()
      .then((data) => setAgendasCount(data));
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full p-4 overflow-auto">
      <div className="relative py-2 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-600">{Util.today_date()}</p>
          <h1 className="text-2xl font-bold text-neutral-800">Olá, {user}!</h1>
        </div>
      </div>

      <div className="h-dvh">
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
      </div>
    </div>
  );
}

export default Home;
