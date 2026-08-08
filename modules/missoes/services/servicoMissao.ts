import {
    RequisicaoAtualizarMissao,
    RequisicaoCriarMissao,
} from "../types/missao.types";
import { repositorioMissao } from "../repositories";

export async function listarMissoes() {
    return repositorioMissao.listar();
}

export async function buscarMissaoPorId(id: number) {
    return repositorioMissao.buscarPorId(id);
}

export async function criarMissao(dados: RequisicaoCriarMissao) {
    return repositorioMissao.criar(dados);
}

export async function atualizarMissao(id: number, dados: RequisicaoAtualizarMissao) {
    return repositorioMissao.atualizar(id, dados);
}

export async function deletarMissao(id: number) {
    return repositorioMissao.deletar(id);
}
