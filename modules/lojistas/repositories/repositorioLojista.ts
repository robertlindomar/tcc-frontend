import {
    FiltroListarLojista,
    Lojista,
    RequisicaoAtualizarLojista,
    RequisicaoCriarLojista,
} from "../types/lojista.types";

export interface RepositorioLojista {
    listar(filtro?: FiltroListarLojista): Promise<Lojista[]>;
    buscarPorId(id: number): Promise<Lojista | null>;
    criar(dados: RequisicaoCriarLojista): Promise<Lojista>;
    atualizar(id: number, dados: RequisicaoAtualizarLojista): Promise<Lojista>;
    aprovar(id: number): Promise<Lojista>;
    rejeitar(id: number): Promise<Lojista>;
    deletar(id: number): Promise<void>;
}
