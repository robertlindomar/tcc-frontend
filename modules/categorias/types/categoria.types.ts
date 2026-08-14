export interface Categoria {
    id: number;
    nome: string;
    lojistaId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarCategoria {
    nome: string;
}

export interface RequisicaoAtualizarCategoria {
    nome: string;
}
