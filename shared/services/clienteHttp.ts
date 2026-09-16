import axios from "axios";

export const clienteHttp = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

clienteHttp.interceptors.request.use((config) => {
    if (typeof window === "undefined") {
        return config;
    }

    const token = localStorage.getItem("auth_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/**
 * 401 fora de `/auth` significa sessão inválida: limpa credenciais e volta ao
 * login. Em `/auth` o próprio formulário mostra o erro de credencial.
 */
clienteHttp.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (typeof window === "undefined" || !axios.isAxiosError(error)) {
            return Promise.reject(error);
        }

        const url = error.config?.url ?? "";
        const ehRotaDeAuth = url.startsWith("/auth");

        if (error.response?.status === 401 && !ehRotaDeAuth) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_usuario");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    },
);
