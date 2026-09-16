import axios from "axios";

export type TipoErroApi = "autenticacao" | "permissao" | "outro";

const MSG_SESSAO = "Sua sessão expirou. Entre novamente para continuar.";
const MSG_PERMISSAO = "Você não tem permissão para acessar este recurso.";

function mensagemDoCorpo(error: unknown): string | null {
    if (!axios.isAxiosError(error)) {
        return null;
    }

    const data = error.response?.data;

    if (
        data &&
        typeof data === "object" &&
        "error" in data &&
        typeof (data as { error: unknown }).error === "string" &&
        (data as { error: string }).error.trim()
    ) {
        return (data as { error: string }).error;
    }

    return null;
}

/**
 * Extrai mensagem amigável de erros Axios (`response.data.error`) ou Error.
 * 401/403 sem corpo útil recebem texto próprio para não exibir erro técnico.
 */
export function obterMensagemErroApi(error: unknown, fallback: string): string {
    const doCorpo = mensagemDoCorpo(error);

    if (doCorpo) {
        return doCorpo;
    }

    if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401) {
            return MSG_SESSAO;
        }
        if (status === 403) {
            return MSG_PERMISSAO;
        }
        if (!error.response) {
            return "Não foi possível falar com o servidor. Tente novamente.";
        }

        return fallback;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

/**
 * Separa sessão inválida (401) de permissão/status negados (403) para a UI
 * decidir entre reautenticar e mostrar aviso.
 */
export function classificarErroApi(error: unknown): TipoErroApi {
    if (!axios.isAxiosError(error)) {
        return "outro";
    }

    if (error.response?.status === 401) {
        return "autenticacao";
    }
    if (error.response?.status === 403) {
        return "permissao";
    }

    return "outro";
}
