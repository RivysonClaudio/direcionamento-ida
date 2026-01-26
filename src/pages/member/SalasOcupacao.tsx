import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatabaseService from "../../services/database/DatabaseService";
import SeletorDeBotoes from "../../components/SeletorDeBotoes";
import Util from "../../util/util";

function SalasOcupacao() {
  const navigate = useNavigate();
  const database = DatabaseService.getInstance();

  const [dataSelecionada, setDataSelecionada] = useState<string>("HOJE");
  const turno = localStorage.getItem("app_turno") === "MANHA" ? "MANHÃ" : "TARDE";
  const [salasOcupadas, setSalasOcupadas] = useState<
    Array<{
      date: string;
      session_time: string;
      room: number;
      names: string[];
    }>
  >([]);

  const salas_options = Array.from({ length: 21 }, (_, i) => i);

  const selectedISODate = Util.iso_date(
    dataSelecionada === "ONTEM" ? -1 : dataSelecionada === "HOJE" ? 0 : 1
  );

  useEffect(() => {
    database
      .get_therapy_sessions_with_names_by_date_time_room()
      .then((data) => setSalasOcupadas(data))
      .catch((err) => console.error(err));
  }, []);

  const getHorariosOcupadosPorSala = (sala: number) => {
    const horarios = salasOcupadas
      .filter(
        (item) =>
          item.room === sala &&
          item.date === selectedISODate &&
          ((turno === "MANHÃ" && item.session_time <= "11:45") ||
            (turno === "TARDE" && item.session_time >= "13:15"))
      )
      .sort((a, b) => (a.session_time < b.session_time ? -1 : 1));
    return horarios;
  };

  return (
    <div className="h-full flex flex-col py-4 px-2 bg-(--blue)">
      <div className="relative py-2 flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-0 left-0 p-2 text-neutral-600 hover:text-neutral-800 transition-colors"
          title="Voltar"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-800">
            Ocupação de Salas
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-2">
        <SeletorDeBotoes
          label="Dia"
          options={["ONTEM", "HOJE", "AMANHÃ"]}
          valorSelecionado={dataSelecionada}
          onChange={(data: string) => setDataSelecionada(data)}
        />
      </div>

      <div className="flex flex-col p-3 mx-2 gap-2 bg-white rounded-lg border border-gray-200 overflow-y-auto scrollbar-hidden">
        <label className="text-sm font-medium text-neutral-600">Ocupação</label>
        {salas_options.map((sala) => {
          const horarios = getHorariosOcupadosPorSala(sala);
          const isOcupada = horarios.length > 0;

          return (
            <div
              key={sala}
              className={`rounded-lg p-3 transition-all ${
                isOcupada
                  ? "bg-blue-50 border-l-4 border-blue-500"
                  : "bg-gray-50 border-l-4 border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-bold ${
                    isOcupada ? "text-blue-700" : "text-neutral-400"
                  }`}
                >
                  {sala === 0 ? "Externa" : `Sala ${sala}`}
                </span>
                {isOcupada && (
                  <span className="text-xs text-blue-600 font-medium">
                    {horarios.length} horário
                    {horarios.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {isOcupada ? (
                <div className="flex flex-col gap-2">
                  {horarios.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-1 bg-blue-500 text-white text-xs p-2 rounded-md"
                    >
                      <span className="font-medium">{h.session_time}</span>
                      <div className="flex flex-col gap-1">
                        {h.names.map((name, nameIdx) => (
                          <span
                            key={nameIdx}
                            className="text-[11px] text-blue-100"
                          >
                            • {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-neutral-400">Disponível</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SalasOcupacao;
