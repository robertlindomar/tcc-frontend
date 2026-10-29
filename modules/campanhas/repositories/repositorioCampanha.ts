import {
    Campanha,
    EdicaoCampanha,
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
    RequisicaoReativarCampanha,
} from "../types/campanha.types";

export interface RepositorioCampanha {
    listar(): Promise<Campanha[]>;
    buscarPorId(id: number): Promise<Campanha | null>;
    criar(dados: RequisicaoCriarCampanha): Promise<Campanha>;
    atualizar(id: number, dados: RequisicaoAtualizarCampanha): Promise<Campanha>;
    /** `forcar` apaga também tickets, notas e sorteios (exclusão definitiva). */
    deletar(id: number, forcar?: boolean): Promise<void>;
    inativar(id: number): Promise<Campanha>;
    reativar(id: number, dados: RequisicaoReativarCampanha): Promise<Campanha>;
    listarEdicoes(id: number): Promise<EdicaoCampanha[]>;
}
