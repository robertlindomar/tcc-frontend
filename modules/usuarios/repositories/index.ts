import { repositorioUsuarioApi } from "./repositorioUsuarioApi";
import { repositorioUsuarioMock } from "./repositorioUsuarioMock";

const usarMock = process.env.NEXT_PUBLIC_USAR_MOCK === "true";

export const repositorioUsuario = usarMock
    ? repositorioUsuarioMock
    : repositorioUsuarioApi;
