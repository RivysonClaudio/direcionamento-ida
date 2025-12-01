const originalFetch = window.fetch;

import { mostrarNotificacao } from "./notificacao";

window.fetch = async function (...args) {
  // eslint-disable-next-line prefer-const
  let [url, config] = args;

  const token = localStorage.getItem("authToken");
  if (config) {
    config.headers = {
      ...config.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...{ apikey: import.meta.env.VITE_SUPABASE_KEY },
      "Content-Type": "application/json",
    };
  } else if (token) {
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_KEY,
        "Content-Type": "application/json",
      },
    };
  }

  try {
    const response = await originalFetch(url, config);

    if (!response.ok) {
      const errorMsg = `${response.status} ${response.statusText}`;
      mostrarNotificacao(errorMsg, "error");

      // Redirecionar para login se for erro de autenticação
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    const errorMsg = `Erro: ${error}`;
    mostrarNotificacao(errorMsg, "error");
    throw error;
  }
};

export {};
