import { RequisicaoConcluirMissao } from "../types/missao-consumidor.types";
import { repositorioMissaoConsumidor } from "../repositories";

export async function listarMissoesConcluidas() {
    return repositorioMissaoConsumidor.listar();
}

export async function concluirMissao(dados: RequisicaoConcluirMissao) {
    return repositorioMissaoConsumidor.concluir(dados);
}
