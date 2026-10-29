import {
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
    RequisicaoReativarCampanha,
} from "../types/campanha.types";
import { repositorioCampanha } from "../repositories";

export async function listarCampanhas() {
    return repositorioCampanha.listar();
}

export async function buscarCampanhaPorId(id: number) {
    return repositorioCampanha.buscarPorId(id);
}

export async function criarCampanha(dados: RequisicaoCriarCampanha) {
    return repositorioCampanha.criar(dados);
}

export async function atualizarCampanha(
    id: number,
    dados: RequisicaoAtualizarCampanha,
) {
    return repositorioCampanha.atualizar(id, dados);
}

export async function deletarCampanha(id: number, forcar = false) {
    return repositorioCampanha.deletar(id, forcar);
}

export async function inativarCampanha(id: number) {
    return repositorioCampanha.inativar(id);
}

export async function reativarCampanha(id: number, dados: RequisicaoReativarCampanha) {
    return repositorioCampanha.reativar(id, dados);
}

export async function listarEdicoesCampanha(id: number) {
    return repositorioCampanha.listarEdicoes(id);
}
