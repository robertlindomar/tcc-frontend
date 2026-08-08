import {
    RequisicaoAtualizarSexo,
    RequisicaoCriarSexo,
    Sexo,
} from "../types/sexo.types";

export interface RepositorioSexo {
    listar(): Promise<Sexo[]>;
    buscarPorId(id: number): Promise<Sexo | null>;
    criar(dados: RequisicaoCriarSexo): Promise<Sexo>;
    atualizar(id: number, dados: RequisicaoAtualizarSexo): Promise<Sexo>;
    deletar(id: number): Promise<void>;
}
