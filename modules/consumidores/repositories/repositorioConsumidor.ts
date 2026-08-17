import {
    Consumidor,
    ListagemVisitantesLoja,
    RequisicaoAtualizarConsumidor,
    RequisicaoCriarConsumidor,
} from "../types/consumidor.types";

export interface RepositorioConsumidor {
    listar(): Promise<ListagemVisitantesLoja>;
    buscarPorId(id: number): Promise<Consumidor | null>;
    criar(dados: RequisicaoCriarConsumidor): Promise<Consumidor>;
    atualizar(id: number, dados: RequisicaoAtualizarConsumidor): Promise<Consumidor>;
    deletar(id: number): Promise<void>;
}
