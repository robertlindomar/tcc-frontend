/**
 * Modelo alinhado ao contrato HTTP `/evento` (camelCase).
 * Não usar `id_evento` — esse é stub UML, não o contrato da API.
 * Não enviar `lojistaId` no body — o backend resolve pelo JWT do lojista aprovado.
 */
export interface Evento {
    id: number;
    nome: string;
    descricao: string | null;
    lojistaId: number;
    urlImagem: string | null;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarEvento {
    nome: string;
    descricao?: string | null;
}

export interface RequisicaoAtualizarEvento {
    nome: string;
    descricao?: string | null;
}
