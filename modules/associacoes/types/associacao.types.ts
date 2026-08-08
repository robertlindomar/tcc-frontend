/**
 * Modelo alinhado ao contrato HTTP `/associacao` (camelCase).
 * Não usar `id_associacao` — esse é stub UML, não o contrato da API.
 */
export interface Associacao {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: number | null;
    usuarioId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarAssociacao {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual?: number | null;
}

export interface RequisicaoAtualizarAssociacao {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual?: number | null;
}
