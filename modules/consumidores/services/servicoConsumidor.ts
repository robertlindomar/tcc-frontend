import {
    RequisicaoAtualizarConsumidor,
    RequisicaoCriarConsumidor,
} from "../types/consumidor.types";
import { repositorioConsumidor } from "../repositories";

export async function listarConsumidores() {
    return repositorioConsumidor.listar();
}

export async function buscarConsumidorPorId(id: number) {
    return repositorioConsumidor.buscarPorId(id);
}

export async function criarConsumidor(dados: RequisicaoCriarConsumidor) {
    return repositorioConsumidor.criar(dados);
}

export async function atualizarConsumidor(
    id: number,
    dados: RequisicaoAtualizarConsumidor,
) {
    return repositorioConsumidor.atualizar(id, dados);
}

export async function deletarConsumidor(id: number) {
    return repositorioConsumidor.deletar(id);
}
