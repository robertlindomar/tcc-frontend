import {
    FiltroListarLojista,
    RequisicaoAtualizarLojista,
    RequisicaoCriarLojista,
} from "../types/lojista.types";
import { repositorioLojista } from "../repositories";

export async function listarLojistas(filtro?: FiltroListarLojista) {
    return repositorioLojista.listar(filtro);
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
