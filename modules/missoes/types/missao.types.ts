/**
 * Modelo alinhado ao contrato HTTP `/missao` (camelCase).
 * Não usar `id_missao` — esse é stub UML, não o contrato da API.
 * Não enviar `lojistaId` no body — o backend resolve pelo JWT do lojista aprovado.
 */
export interface Missao {
    id: number;
    nome: string;
    descricao: string | null;
    pontoRecompensa: number;
    lojistaId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarMissao {
    nome: string;
    descricao?: string | null;
    pontoRecompensa: number;
}

export interface RequisicaoAtualizarMissao {
    nome: string;
    descricao?: string | null;
    pontoRecompensa?: number;
}
