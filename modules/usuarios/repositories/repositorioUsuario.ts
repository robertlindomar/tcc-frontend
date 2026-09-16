import { RequisicaoAtualizarUsuario, RequisicaoCriarUsuario, Usuario } from "../types/usuario.types";

export interface RepositorioUsuario {
    listar(): Promise<Usuario[]>;
    buscarPorId(id: number): Promise<Usuario | null>;
    criar(dados: RequisicaoCriarUsuario): Promise<Usuario>;
    atualizar(id: number, dados: RequisicaoAtualizarUsuario): Promise<Usuario>;
    deletar(id: number): Promise<void>;
}
