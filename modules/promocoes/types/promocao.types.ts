/**
 * Modelo alinhado ao contrato HTTP `/promocao` (camelCase).
 * Não usar `id_promocao` — esse é stub UML, não o contrato da API.
 */
export type StatusVigenciaPromocao = "ATIVA" | "DESATIVADA" | "EXPIRADA";

export interface Promocao {
    id: number;
    descricao: string | null;
    preco: number;
    produtoId: number;
    ativa: boolean;
    dataInicio: Date;
    dataFim: Date;
    statusVigencia: StatusVigenciaPromocao;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarPromocao {
    descricao?: string | null;
    preco: number;
    produtoId: number;
    duracaoDias: number;
}

export interface RequisicaoAtualizarPromocao {
    descricao?: string | null;
    preco: number;
    produtoId: number;
    duracaoDias?: number;
}
