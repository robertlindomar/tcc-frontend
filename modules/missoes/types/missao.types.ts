/**
 * Modelo alinhado ao contrato HTTP `/missao` (camelCase).
 * Não usar `id_missao` — esse é stub UML, não o contrato da API.
 * Não enviar `lojistaId` no body — o backend resolve pelo JWT do lojista aprovado.
 */
export type FrequenciaMissao = "UMA_VEZ" | "DIARIA" | "SEMANAL" | "MENSAL";

export interface Missao {
    id: number;
    nome: string;
    descricao: string | null;
    pontoRecompensa: number;
    frequencia: FrequenciaMissao;
    dataFim: Date | null;
    dataFimCivil: string | null;
    expirada: boolean;
    sistema: boolean;
    lojistaId: number;
    tokenQr: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarMissao {
    nome: string;
    descricao?: string | null;
    pontoRecompensa: number;
    frequencia: FrequenciaMissao;
    dataFim: string;
}

export interface RequisicaoAtualizarMissao {
    nome?: string;
    descricao?: string | null;
    pontoRecompensa?: number;
    frequencia?: FrequenciaMissao;
    dataFim?: string;
}
