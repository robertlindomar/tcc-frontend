import {
    Promocao,
    RequisicaoAtualizarPromocao,
    RequisicaoCriarPromocao,
} from "../types/promocao.types";

export interface RepositorioPromocao {
    listar(): Promise<Promocao[]>;
    buscarPorId(id: number): Promise<Promocao | null>;
    criar(dados: RequisicaoCriarPromocao): Promise<Promocao>;
    atualizar(id: number, dados: RequisicaoAtualizarPromocao): Promise<Promocao>;
    deletar(id: number): Promise<void>;
}
