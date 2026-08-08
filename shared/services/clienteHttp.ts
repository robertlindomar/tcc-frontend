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
