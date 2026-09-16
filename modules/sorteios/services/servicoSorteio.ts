import {
    RequisicaoAtualizarSorteio,
    RequisicaoCriarSorteio,
} from "../types/sorteio.types";
import { repositorioSorteio } from "../repositories";

export async function listarSorteios() {
    return repositorioSorteio.listar();
}

export async function buscarSorteioPorId(id: number) {
    return repositorioSorteio.buscarPorId(id);
}

export async function criarSorteio(dados: RequisicaoCriarSorteio) {
    return repositorioSorteio.criar(dados);
}

export async function atualizarSorteio(
    id: number,
    dados: RequisicaoAtualizarSorteio,
) {
    return repositorioSorteio.atualizar(id, dados);
}

export async function deletarSorteio(id: number) {
    return repositorioSorteio.deletar(id);
}
