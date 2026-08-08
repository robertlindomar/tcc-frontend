import {
    Campanha,
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
} from "../types/campanha.types";

export interface RepositorioCampanha {
    listar(): Promise<Campanha[]>;
    buscarPorId(id: number): Promise<Campanha | null>;
    criar(dados: RequisicaoCriarCampanha): Promise<Campanha>;
    atualizar(id: number, dados: RequisicaoAtualizarCampanha): Promise<Campanha>;
    deletar(id: number): Promise<void>;
}
