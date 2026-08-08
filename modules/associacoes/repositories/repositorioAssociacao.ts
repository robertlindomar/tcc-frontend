import {
    Associacao,
    RequisicaoAtualizarAssociacao,
    RequisicaoCriarAssociacao,
} from "../types/associacao.types";

export interface RepositorioAssociacao {
    listar(): Promise<Associacao[]>;
    buscarPorId(id: number): Promise<Associacao | null>;
    criar(dados: RequisicaoCriarAssociacao): Promise<Associacao>;
    atualizar(id: number, dados: RequisicaoAtualizarAssociacao): Promise<Associacao>;
    deletar(id: number): Promise<void>;
}
