import {
    RequisicaoAtualizarCategoria,
    RequisicaoCriarCategoria,
    Categoria,
} from "../types/categoria.types";

export interface RepositorioCategoria {
    listar(): Promise<Categoria[]>;
    buscarPorId(id: number): Promise<Categoria | null>;
    criar(dados: RequisicaoCriarCategoria): Promise<Categoria>;
    atualizar(id: number, dados: RequisicaoAtualizarCategoria): Promise<Categoria>;
    deletar(id: number): Promise<void>;
}
