import {
    Missao,
    RequisicaoAtualizarMissao,
    RequisicaoCriarMissao,
} from "../types/missao.types";

export interface RepositorioMissao {
    listar(): Promise<Missao[]>;
    buscarPorId(id: number): Promise<Missao | null>;
    criar(dados: RequisicaoCriarMissao): Promise<Missao>;
    atualizar(id: number, dados: RequisicaoAtualizarMissao): Promise<Missao>;
    deletar(id: number): Promise<void>;
}
