import {
    RequisicaoAtualizarProduto,
    RequisicaoCriarProduto,
} from "../types/produto.types";
import { repositorioProduto } from "../repositories";

export async function listarProdutos() {
    return repositorioProduto.listar();
}

export async function buscarProdutoPorId(id: number) {
    return repositorioProduto.buscarPorId(id);
}

export async function criarProduto(dados: RequisicaoCriarProduto) {
    return repositorioProduto.criar(dados);
}

export async function atualizarProduto(
    id: number,
    dados: RequisicaoAtualizarProduto,
) {
    return repositorioProduto.atualizar(id, dados);
}

export async function enviarImagemProduto(id: number, arquivo: File) {
    return repositorioProduto.enviarImagem(id, arquivo);
}

export async function deletarProduto(id: number) {
    return repositorioProduto.deletar(id);
}
