import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import {
  type Notificacao,
  adicionarListener,
  removerListener,
} from "../util/notificacao";

function NotificacaoGlobal() {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  useEffect(() => {
    const listener = (notificacao: Notificacao) => {
      setNotificacoes((prev) => [...prev, notificacao]);

      setTimeout(() => {
        setNotificacoes((prev) => prev.filter((n) => n.id !== notificacao.id));
      }, 5000);
    };

    adicionarListener(listener);

    return () => {
      removerListener(listener);
    };
  }, []);

  const removerNotificacao = (id: number) => {
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
  };

  const config = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: XCircle,
      iconColor: "text-red-600",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: AlertCircle,
      iconColor: "text-yellow-600",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: Info,
      iconColor: "text-blue-600",
    },
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notificacoes.map((notificacao) => {
        const style = config[notificacao.tipo];
        const IconComponent = style.icon;

        return (
          <div
            key={notificacao.id}
            className={`${style.bg} ${style.border} border ${style.text} px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 animate-slide-in-right`}
          >
            <IconComponent
              className={`${style.iconColor} flex-shrink-0 mt-0.5`}
              size={20}
            />
            <p className="text-sm flex-1">{notificacao.mensagem}</p>
            <button
              onClick={() => removerNotificacao(notificacao.id)}
              className={`${style.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default NotificacaoGlobal;
