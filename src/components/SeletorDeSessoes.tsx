import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

function SeletorDeSessoes() {
  const hora_sessoes: string[] = [
    "13:15 - 14:00",
    "14:00 - 14:45",
    "14:45 - 15:30",
    "15:30 - 16:15",
    "16:15 - 17:00",
    "17:00 - 17:45",
    "17:45 - 18:30",
  ];

  const [sessao_atual, setSessaoAtual] = useState(0);

  const anterior_sessao = () => {
    if (sessao_atual > 0) {
      return setSessaoAtual(sessao_atual - 1);
    }
    return setSessaoAtual(hora_sessoes.length - 1);
  };

  const proxima_sessao = () => {
    if (sessao_atual < hora_sessoes.length - 1) {
      return setSessaoAtual(sessao_atual + 1);
    }
    return setSessaoAtual(0);
  };

  return (
    <div className="relative py-2">
      <ChevronLeft
        onClick={() => {
          anterior_sessao();
        }}
        className="absolute left-0 w-8 h-full top-0"
      />
      <h2 className="text-center">{hora_sessoes[sessao_atual]}</h2>
      <ChevronRight
        onClick={() => {
          proxima_sessao();
        }}
        className="absolute right-0 w-8 h-full top-0"
      />
    </div>
  );
}

export default SeletorDeSessoes;
