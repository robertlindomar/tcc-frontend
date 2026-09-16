import { RequisicaoAtualizarUsuario, RequisicaoCriarUsuario } from "../types/usuario.types";
import { repositorioUsuario } from "../repositories";

export async function listarUsuarios() {
    return repositorioUsuario.listar();
}

export async function buscarUsuarioPorId(id: number) {
    return repositorioUsuario.buscarPorId(id);
}

export async function criarUsuario(dados: RequisicaoCriarUsuario) {
    return repositorioUsuario.criar(dados);
}

export async function atualizarUsuario(id: number, dados: RequisicaoAtualizarUsuario) {
    return repositorioUsuario.atualizar(id, dados);
}

export async function deletarUsuario(id: number) {
    return repositorioUsuario.deletar(id);
}
