import { repositorioEndereco } from "../repositories";
import {
    RequisicaoAtualizarEndereco,
    RequisicaoCriarEndereco,
} from "../types/endereco.types";

export async function buscarEnderecoDoUsuario(usuarioId: number) {
    return repositorioEndereco.buscarPorUsuario(usuarioId);
}

export async function criarEndereco(dados: RequisicaoCriarEndereco) {
    return repositorioEndereco.criar(dados);
}

export async function atualizarEndereco(
    id: number,
    dados: RequisicaoAtualizarEndereco,
) {
    return repositorioEndereco.atualizar(id, dados);
}

export async function deletarEndereco(id: number) {
    return repositorioEndereco.deletar(id);
}
