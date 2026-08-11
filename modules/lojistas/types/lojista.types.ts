/**
 * Modelo alinhado ao contrato HTTP `/lojista` (camelCase).
 * Não usar `id_lojista` — esse é stub UML, não o contrato da API.
 */
export type StatusLojista = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface Lojista {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: number | null;
    status: StatusLojista;
    usuarioId: number;
    associacaoId: number;
    enderecoId: number | null;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarLojista {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual?: number | null;
    associacaoId: number;
    enderecoId?: number | null;
}

export interface RequisicaoAtualizarLojista {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual?: number | null;
    enderecoId?: number | null;
}

export interface FiltroListarLojista {
    status?: StatusLojista;
}
