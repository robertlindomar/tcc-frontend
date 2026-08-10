import {
    RequisicaoAtualizarCategoria,
    RequisicaoCriarCategoria,
} from "../types/categoria.types";
import { repositorioCategoria } from "../repositories";

export async function listarCategorias() {
    return repositorioCategoria.listar();
}

export async function buscarCategoriaPorId(id: number) {
    return repositorioCategoria.buscarPorId(id);
}

export async function criarCategoria(dados: RequisicaoCriarCategoria) {
    return repositorioCategoria.criar(dados);
}

export async function atualizarCategoria(
    id: number,
    dados: RequisicaoAtualizarCategoria,
) {
    return repositorioCategoria.atualizar(id, dados);
}

export async function deletarCategoria(id: number) {
    return repositorioCategoria.deletar(id);
}
