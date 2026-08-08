/**
 * Modelo alinhado ao contrato HTTP `/sorteio` (camelCase).
 * Não usar `id_sorteio` — esse é stub UML, não o contrato da API.
 * `campanhaId` deve apontar para campanha da associação logada (JWT).
 */
export interface Sorteio {
    id: number;
    qrcode: string | null;
    campanhaId: number;
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
