import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoCriarUsuario,
    Usuario,
    PapelUsuario,
} from "@/modules/usuarios/types/usuario.types";
import { RequisicaoLogin, RespostaLogin } from "../types/auth.types";

const CHAVE_AUTH = "auth_usuario";
const CHAVE_TOKEN = "auth_token";

type UsuarioSemSenha = Omit<Usuario, "senha">;

/** Contrato real da API (camelCase Prisma). */
type UsuarioApiResponse = {
    id: number;
    nome: string;
    email: string;
    role: PapelUsuario;
    ativo: boolean;
    createdAt: string;
    updatedAt: string;
};

interface LoginApiResponse {
    token: string;
    usuario: UsuarioApiResponse;
}

function mapUsuarioApi(usuario: UsuarioApiResponse): UsuarioSemSenha {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        ativo: usuario.ativo,
        data_criacao: new Date(usuario.createdAt),
        data_atualizacao: new Date(usuario.updatedAt),
    };
}

function salvarAutenticacao(resposta: RespostaLogin) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(CHAVE_AUTH, JSON.stringify(resposta));
    localStorage.setItem(CHAVE_TOKEN, resposta.token);
}

export function buscarToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(CHAVE_TOKEN);
}

export function buscarUsuarioLogadoApi(): RespostaLogin | null {
    if (typeof window === "undefined") {
        return null;
    }

    const dados = localStorage.getItem(CHAVE_AUTH);

    if (!dados) {
        return null;
    }

    const resposta = JSON.parse(dados) as RespostaLogin;

    return {
        ...resposta,
        usuario: {
            ...resposta.usuario,
            data_criacao: new Date(resposta.usuario.data_criacao),
            data_atualizacao: new Date(resposta.usuario.data_atualizacao),
        },
    };
}

export function sairApi() {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(CHAVE_AUTH);
    localStorage.removeItem(CHAVE_TOKEN);
}

export async function entrarApi(dados: RequisicaoLogin): Promise<RespostaLogin> {
    const response = await clienteHttp.post<LoginApiResponse>("/auth/login", {
        email: dados.email,
        senha: dados.senha,
    });

    const resposta: RespostaLogin = {
        usuario: mapUsuarioApi(response.data.usuario),
        token: response.data.token,
    };

    salvarAutenticacao(resposta);

    return resposta;
}

export async function cadastrarUsuarioApi(
    dados: RequisicaoCriarUsuario
): Promise<UsuarioSemSenha> {
    const response = await clienteHttp.post<UsuarioApiResponse>("/auth/cadastro", {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        role: dados.role,
    });

    return mapUsuarioApi(response.data);
}
