/**
 * Modelo alinhado ao contrato HTTP `/produto` (camelCase).
 * Não usar `id_produto` — esse é stub UML, não o contrato da API.
 * Não enviar `lojistaId` no body — o backend resolve pelo JWT do lojista aprovado.
 */
export interface Produto {
    id: number;
    nome: string;
    valor: number;
    categoriaId: number | null;
    lojistaId: number;
    urlImagem: string | null;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarProduto {
    nome: string;
    valor: number;
    categoriaId?: number | null;
}

export interface RequisicaoAtualizarProduto {
    nome: string;
    valor: number;
    categoriaId?: number | null;
}
