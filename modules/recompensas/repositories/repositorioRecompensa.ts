import {
    CatalogoRecompensa,
    Recompensa,
    RequisicaoAtualizarRecompensa,
    RequisicaoCriarRecompensa,
    ResgateRecompensa,
    RespostaResgatar,
} from "../types/recompensa.types";

export interface RepositorioRecompensa {
    listar(): Promise<Recompensa[]>;
    criar(dados: RequisicaoCriarRecompensa): Promise<Recompensa>;
    atualizar(id: number, dados: RequisicaoAtualizarRecompensa): Promise<Recompensa>;
    desativar(id: number): Promise<Recompensa>;
    deletar(id: number): Promise<void>;
    catalogo(): Promise<CatalogoRecompensa>;
    resgatar(id: number): Promise<RespostaResgatar>;
    listarResgates(): Promise<ResgateRecompensa[]>;
}
