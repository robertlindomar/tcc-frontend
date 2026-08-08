/**
 * Modelo alinhado ao contrato HTTP `/sexo` (camelCase).
 * Não usar `id_sexo` — esse é stub UML, não o contrato da API.
 */
export interface Sexo {
    id: number;
    nome: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarSexo {
    nome: string;
}

export interface RequisicaoAtualizarSexo {
    nome: string;
}
