import {
    Produto,
    RequisicaoAtualizarProduto,
    RequisicaoCriarProduto,
} from "../types/produto.types";

export interface RepositorioProduto {
    listar(): Promise<Produto[]>;
    buscarPorId(id: number): Promise<Produto | null>;
    criar(dados: RequisicaoCriarProduto, arquivo: File): Promise<Produto>;
    atualizar(id: number, dados: RequisicaoAtualizarProduto): Promise<Produto>;
    enviarImagem(id: number, arquivo: File): Promise<Produto>;
    deletar(id: number): Promise<void>;
}
