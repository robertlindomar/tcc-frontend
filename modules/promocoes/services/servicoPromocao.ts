import {
    RequisicaoAtualizarPromocao,
    RequisicaoCriarPromocao,
} from "../types/promocao.types";
import { repositorioPromocao } from "../repositories";

export async function listarPromocoes() {
    return repositorioPromocao.listar();
}

export async function buscarPromocaoPorId(id: number) {
    return repositorioPromocao.buscarPorId(id);
}

export async function criarPromocao(dados: RequisicaoCriarPromocao) {
    return repositorioPromocao.criar(dados);
}

export async function atualizarPromocao(
    id: number,
    dados: RequisicaoAtualizarPromocao,
) {
    return repositorioPromocao.atualizar(id, dados);
}

export async function desativarPromocao(id: number) {
    return repositorioPromocao.desativar(id);
}

export async function reativarPromocao(id: number) {
    return repositorioPromocao.reativar(id);
}

export async function deletarPromocao(id: number) {
    return repositorioPromocao.deletar(id);
}
