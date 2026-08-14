import {
    RequisicaoAtualizarEvento,
    RequisicaoCriarEvento,
} from "../types/evento.types";
import { repositorioEvento } from "../repositories";

export async function listarEventos() {
    return repositorioEvento.listar();
}

export async function buscarEventoPorId(id: number) {
    return repositorioEvento.buscarPorId(id);
}

export async function criarEvento(dados: RequisicaoCriarEvento) {
    return repositorioEvento.criar(dados);
}

export async function atualizarEvento(id: number, dados: RequisicaoAtualizarEvento) {
    return repositorioEvento.atualizar(id, dados);
}

export async function enviarImagemEvento(id: number, arquivo: File) {
    return repositorioEvento.enviarImagem(id, arquivo);
}

export async function deletarEvento(id: number) {
    return repositorioEvento.deletar(id);
}
