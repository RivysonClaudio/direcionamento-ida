const originalFetch = window.fetch;

import type { ErrorResponseDTO } from "../services/database/ErrorResponseDTO";
import { mostrarNotificacao } from "./notificacao";
import { setLoadingGlobal } from "../components/LoadingGlobal";

// Expor originalFetch globalmente para casos especiais
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.originalFetch = originalFetch;

window.fetch = async function (...args) {
  const [url, config] = args;

  try {
    // Não mostra loading para requisições de autenticação
    const isAuthRequest = typeof url === "string" && url.includes("/auth/");

    if (!isAuthRequest) {
      setLoadingGlobal(true);
    }

    const response = await originalFetch(url, config);

    if (!isAuthRequest) {
      setLoadingGlobal(false);
    }

    if (!response.ok) {
      const errorResponse: ErrorResponseDTO = await response.json();

      switch (errorResponse.code) {
        case "PGRST116":
          mostrarNotificacao(
            "Ação não permitida. Você não tem permissão para executar esta ação.",
            "error"
          );
          break;
        case "PGRST117":
          mostrarNotificacao(
            "Ação não permitida. Você não tem permissão para acessar este recurso.",
            "error"
          );
          break;
        case "23502":
          mostrarNotificacao(
            "Ação não concluída. Dados incompletos.",
            "warning"
          );
          break;
        case "23503":
          mostrarNotificacao(
            "Ação não concluída. Registro relacionado não encontrado.",
            "warning"
          );
          break;
        case "23505":
          mostrarNotificacao(
            "Ação não concluída. Registro duplicado.",
            "warning"
          );
          break;
        case "23514":
          mostrarNotificacao(
            "Ação não concluída. Violação de restrição de dados.",
            "warning"
          );
          break;
        default:
          mostrarNotificacao(
            `Erro ao processar a requisição: ${errorResponse.message}`,
            "error"
          );
          break;
      }

      // Redirecionar para login se for erro de autenticação
      if (response.status === 401 || response.status === 403) {
        mostrarNotificacao("Sessão expirada. Faça login novamente.", "warning");
        window.location.href = "/login";
      }
    }

    return response;
  } catch (error) {
    setLoadingGlobal(false);
    const errorMsg = `Erro: ${error}`;
    mostrarNotificacao(errorMsg, "error");
    throw error;
  }
};

export {};
