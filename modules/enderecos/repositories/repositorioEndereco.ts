import {
    Endereco,
    RequisicaoAtualizarEndereco,
    RequisicaoCriarEndereco,
} from "../types/endereco.types";

export interface RepositorioEndereco {
    /** `null` quando o usuário ainda não tem endereço (404 da API). */
    buscarPorUsuario(usuarioId: number): Promise<Endereco | null>;
    criar(dados: RequisicaoCriarEndereco): Promise<Endereco>;
    atualizar(id: number, dados: RequisicaoAtualizarEndereco): Promise<Endereco>;
    deletar(id: number): Promise<void>;
}
