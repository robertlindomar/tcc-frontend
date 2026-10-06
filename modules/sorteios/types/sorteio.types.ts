/**
 * Modelo alinhado ao contrato HTTP `/sorteio` (camelCase).
 * Não usar `id_sorteio` — esse é stub UML, não o contrato da API.
 * `campanhaId` deve apontar para campanha da associação logada (JWT).
 */
export type SituacaoResultadoSorteio = "AGUARDANDO_ENTREGA" | "ENTREGUE" | "CANCELADO";

export interface ResultadoSorteio {
    id: number;
    numeroSorteado: number;
    totalTickets: number;
    situacao: SituacaoResultadoSorteio;
    dataSorteio: Date;
    dataAtualizacao: Date;
    vencedor: {
        consumidorId: number;
        nome: string;
        email: string;
        cpfMascarado: string;
    };
}

export interface Sorteio {
    id: number;
    qrcode: string | null;
    campanhaId: number;
    totalTickets: number;
    campanhaEncerrada: boolean;
    resultadoAtual: ResultadoSorteio | null;
    /** Mais recente primeiro. */
    historico: ResultadoSorteio[];
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarSorteio {
    campanhaId: number;
    qrcode?: string | null;
}

export interface RequisicaoAtualizarSorteio {
    campanhaId: number;
    qrcode?: string | null;
}
