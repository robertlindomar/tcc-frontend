/**
 * Modelo alinhado ao contrato HTTP `/campanha` (camelCase).
 * Não usar `id_campanha` — esse é stub UML, não o contrato da API.
 * Não enviar `associacaoId` no body — o backend resolve pelo JWT da associação.
 */
import type { SituacaoSorteioEdicao } from "../utils/campanhaEdicao";

export type { SituacaoSorteioEdicao };

export interface Campanha {
    id: number;
    nome: string;
    descricao: string | null;
    qrcode: string | null;
    dataInicio: Date;
    dataFim: Date;
    dataInicioCivil: string;
    dataFimCivil: string;
    valorPorTicket: number;
    associacaoId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
    ativa: boolean;
    /** Edição atual (1..N). */
    edicao: number;
    /** Tickets da edição atual. */
    totalTickets: number;
    /** Sorteio da edição atual (criado junto com a campanha/edição). */
    sorteioId: number | null;
    periodoEncerrado: boolean;
    situacaoSorteio: SituacaoSorteioEdicao;
}

/** Edição da campanha lida dos snapshots do sorteio (histórico). */
export interface EdicaoCampanha {
    edicao: number;
    atual: boolean;
    dataInicioCivil: string;
    dataFimCivil: string;
    valorPorTicket: number;
    totalTickets: number;
    sorteioId: number;
    periodoEncerrado: boolean;
    situacaoSorteio: SituacaoSorteioEdicao;
    dataSorteio: Date | null;
}

export interface RequisicaoCriarCampanha {
    nome: string;
    descricao?: string | null;
    qrcode?: string | null;
    dataInicio: string;
    dataFim: string;
    valorPorTicket: number;
}

export interface RequisicaoAtualizarCampanha {
    nome: string;
    descricao?: string | null;
    qrcode?: string | null;
    dataInicio: string;
    dataFim: string;
    valorPorTicket: number;
}

export interface RequisicaoReativarCampanha {
    dataInicio: string;
    dataFim: string;
    valorPorTicket?: number;
}
