import {
    RequisicaoAtualizarSorteio,
    RequisicaoCriarSorteio,
    Sorteio,
} from "../types/sorteio.types";

export interface RepositorioSorteio {
    listar(): Promise<Sorteio[]>;
    buscarPorId(id: number): Promise<Sorteio | null>;
    criar(dados: RequisicaoCriarSorteio): Promise<Sorteio>;
    atualizar(id: number, dados: RequisicaoAtualizarSorteio): Promise<Sorteio>;
    deletar(id: number): Promise<void>;
}
