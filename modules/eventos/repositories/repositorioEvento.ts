import {
    Evento,
    RequisicaoAtualizarEvento,
    RequisicaoCriarEvento,
} from "../types/evento.types";

export interface RepositorioEvento {
    listar(): Promise<Evento[]>;
    buscarPorId(id: number): Promise<Evento | null>;
    criar(dados: RequisicaoCriarEvento): Promise<Evento>;
    atualizar(id: number, dados: RequisicaoAtualizarEvento): Promise<Evento>;
    deletar(id: number): Promise<void>;
}
