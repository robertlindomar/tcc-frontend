export interface Categoria {
    id: number;
    nome: string;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarCategoria {
    nome: string;
}

export interface RequisicaoAtualizarCategoria {
    nome: string;
}
