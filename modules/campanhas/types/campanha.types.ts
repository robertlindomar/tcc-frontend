/**
 * Modelo alinhado ao contrato HTTP `/campanha` (camelCase).
 * Não usar `id_campanha` — esse é stub UML, não o contrato da API.
 * Não enviar `associacaoId` no body — o backend resolve pelo JWT da associação.
 */
export interface Campanha {
    id: number;
    nome: string;
    descricao: string | null;
    qrcode: string | null;
    associacaoId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarCampanha {
    nome: string;
    descricao?: string | null;
    qrcode?: string | null;
}

export interface RequisicaoAtualizarCampanha {
    nome: string;
    descricao?: string | null;
    qrcode?: string | null;
}
