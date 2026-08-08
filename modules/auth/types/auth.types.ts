import { Usuario } from "@/modules/usuarios/types/usuario.types";

export interface RequisicaoLogin {
    email: string;
    senha: string;
}

export interface RespostaLogin {
    usuario: Omit<Usuario, "senha">;
    token: string;
}
