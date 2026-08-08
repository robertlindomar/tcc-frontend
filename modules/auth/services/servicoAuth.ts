import { RequisicaoCriarUsuario } from "@/modules/usuarios/types/usuario.types";
import { RequisicaoLogin } from "../types/auth.types";

import {
    entrarMock,
    cadastrarUsuarioMock,
    buscarUsuarioLogado,
    sairMock,
} from "./servicoAuthMock";

import {
    entrarApi,
    cadastrarUsuarioApi,
    buscarUsuarioLogadoApi,
    sairApi,
} from "./servicoAuthApi";

const usarMock = process.env.NEXT_PUBLIC_USAR_MOCK === "true";

export async function entrar(dados: RequisicaoLogin) {
    if (usarMock) {
        return entrarMock(dados);
    }

    return entrarApi(dados);
}

export async function cadastrarUsuario(dados: RequisicaoCriarUsuario) {
    if (usarMock) {
        return cadastrarUsuarioMock(dados);
    }

    return cadastrarUsuarioApi(dados);
}

export function buscarUsuarioLogadoAtual() {
    if (usarMock) {
        return buscarUsuarioLogado();
    }

    return buscarUsuarioLogadoApi();
}

export function sair() {
    if (usarMock) {
        sairMock();
        return;
    }

    sairApi();
}
