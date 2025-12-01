export type TipoNotificacao = "success" | "error" | "warning" | "info";

export interface Notificacao {
  id: number;
  mensagem: string;
  tipo: TipoNotificacao;
}

let notificacaoId = 0;
const listeners: Array<(notificacao: Notificacao) => void> = [];

export const mostrarNotificacao = (
  mensagem: string,
  tipo: TipoNotificacao = "info"
) => {
  const notificacao: Notificacao = {
    id: notificacaoId++,
    mensagem,
    tipo,
  };

  listeners.forEach((listener) => listener(notificacao));
};

export const adicionarListener = (
  listener: (notificacao: Notificacao) => void
) => {
  listeners.push(listener);
};

export const removerListener = (
  listener: (notificacao: Notificacao) => void
) => {
  const index = listeners.indexOf(listener);
  if (index > -1) {
    listeners.splice(index, 1);
  }
};
