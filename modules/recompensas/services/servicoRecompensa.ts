import {
    RequisicaoAtualizarRecompensa,
    RequisicaoCriarRecompensa,
} from "../types/recompensa.types";
import { repositorioRecompensa } from "../repositories";

export async function listarRecompensas() {
    return repositorioRecompensa.listar();
}

export async function criarRecompensa(dados: RequisicaoCriarRecompensa) {
    return repositorioRecompensa.criar(dados);
}

export async function atualizarRecompensa(
    id: number,
    dados: RequisicaoAtualizarRecompensa,
) {
    return repositorioRecompensa.atualizar(id, dados);
}

export async function desativarRecompensa(id: number) {
    return repositorioRecompensa.desativar(id);
}

export async function reativarRecompensa(id: number) {
    return repositorioRecompensa.reativar(id);
}

export async function deletarRecompensa(id: number) {
    return repositorioRecompensa.deletar(id);
}

export async function obterCatalogoRecompensas() {
    return repositorioRecompensa.catalogo();
}

export async function resgatarRecompensa(id: number) {
    return repositorioRecompensa.resgatar(id);
}

export async function listarMeusResgates() {
    return repositorioRecompensa.listarResgates();
}

export async function listarResgatesLoja() {
    return repositorioRecompensa.listarResgatesLoja();
}

export async function confirmarEntregaResgate(id: number) {
    return repositorioRecompensa.confirmarEntrega(id);
}
