import {
    FiltroListarLojista,
    Lojista,
    RequisicaoAtualizarLojista,
    RequisicaoCriarLojista,
} from "../types/lojista.types";
import { repositorioLojista } from "../repositories";

export async function listarLojistas(filtro?: FiltroListarLojista) {
    return repositorioLojista.listar(filtro);
}

/** Perfil do lojista autenticado: GET /lojista já retorna só o próprio (ou []). */
export async function buscarMeuPerfilLojista(): Promise<Lojista | null> {
    const lista = await listarLojistas();
    return lista[0] ?? null;
}

export async function buscarLojistaPorId(id: number) {
    return repositorioLojista.buscarPorId(id);
}

export async function criarLojista(dados: RequisicaoCriarLojista) {
    return repositorioLojista.criar(dados);
}

export async function atualizarLojista(
    id: number,
    dados: RequisicaoAtualizarLojista,
) {
    return repositorioLojista.atualizar(id, dados);
}

export async function aprovarLojista(id: number) {
    return repositorioLojista.aprovar(id);
}

export async function rejeitarLojista(id: number) {
    return repositorioLojista.rejeitar(id);
}

export async function deletarLojista(id: number) {
    return repositorioLojista.deletar(id);
}
