import { useEffect, useState } from "react";
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

  const cores = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notificacoes.map((notificacao) => (
        <div
          key={notificacao.id}
          className={`${
            cores[notificacao.tipo]
          } text-white px-4 py-3 rounded-md shadow-lg max-w-md animate-slide-in`}
        >
          <p className="text-sm">{notificacao.mensagem}</p>
        </div>
      ))}
    </div>
  );
}

export default NotificacaoGlobal;
