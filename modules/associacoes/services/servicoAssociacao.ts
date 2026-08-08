import {
    RequisicaoAtualizarAssociacao,
    RequisicaoCriarAssociacao,
} from "../types/associacao.types";
import { repositorioAssociacao } from "../repositories";

export async function listarAssociacoes() {
    return repositorioAssociacao.listar();
}

export async function buscarAssociacaoPorId(id: number) {
    return repositorioAssociacao.buscarPorId(id);
}

export async function criarAssociacao(dados: RequisicaoCriarAssociacao) {
    return repositorioAssociacao.criar(dados);
}

export async function atualizarAssociacao(
    id: number,
    dados: RequisicaoAtualizarAssociacao,
) {
    return repositorioAssociacao.atualizar(id, dados);
}

export async function deletarAssociacao(id: number) {
    return repositorioAssociacao.deletar(id);
}
