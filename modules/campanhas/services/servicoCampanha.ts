import {
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
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

export async function deletarCampanha(id: number) {
    return repositorioCampanha.deletar(id);
}
