import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import DatabaseService from "../../../services/database/DatabaseService";
import SeletorDeBotoes from "../../../components/SeletorDeBotoes";

function SalaOcupacaoCard() {
  const [salaOcupacao, setSalaOcupacao] = useState<
    Array<{
      week_day: number;
      session_time: string;
      room: number;
      names: string[];
    }>
  >([]);
  const [turno, setTurno] = useState<"MANHÃ" | "TARDE">("TARDE");
  const [diaSelecionado, setDiaSelecionado] = useState<number>(2);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const database = DatabaseService.getInstance();
    database
      .get_agendas_with_names_by_week_day_time_room()
      .then((data) => setSalaOcupacao(data))
      .catch((err) => console.error(err));
  }, []);

  const getHorariosOcupadosPorSala = (sala: number) => {
    const horarios = salaOcupacao.filter(
      (item) =>
        item.room === sala &&
        item.week_day === diaSelecionado &&
        ((turno === "MANHÃ" && item.session_time <= "12:45") ||
          (turno === "TARDE" && item.session_time >= "13:15"))
    );
    return horarios;
  };

  const salas = Array.from({ length: 20 }, (_, i) => i + 1);

  const diasSemana = [
    { value: 2, label: "Seg" },
    { value: 3, label: "Ter" },
    { value: 4, label: "Qua" },
    { value: 5, label: "Qui" },
    { value: 6, label: "Sex" },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left hover:bg-gray-50 transition-colors rounded-t-lg flex items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-neutral-800">
          Ocupação de Salas
        </h3>
        {isOpen ? (
          <ChevronUp size={18} className="text-neutral-600" />
        ) : (
          <ChevronDown size={18} className="text-neutral-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 flex flex-col gap-3">
          <SeletorDeBotoes
            options={["MANHÃ", "TARDE"]}
            valorSelecionado={turno}
            onChange={setTurno}
          />

          <div className="flex gap-2 justify-center">
            {diasSemana.map((dia) => (
              <button
                key={dia.value}
                onClick={() => setDiaSelecionado(dia.value)}
                className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all ${
                  diaSelecionado === dia.value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-neutral-600 hover:bg-gray-200"
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {salas.map((sala) => {
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
                      Sala {sala}
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
      )}
    </div>
  );
}

export default SalaOcupacaoCard;
