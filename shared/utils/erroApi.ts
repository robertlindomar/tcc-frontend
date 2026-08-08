import axios from "axios";

/**
 * Extrai mensagem amigável de erros Axios (`response.data.error`) ou Error.
 */
export function obterMensagemErroApi(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;

        if (
            data &&
            typeof data === "object" &&
            "error" in data &&
            typeof (data as { error: unknown }).error === "string"
        ) {
            return (data as { error: string }).error;
        }

        if (error.message) {
            return error.message;
        }
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}
