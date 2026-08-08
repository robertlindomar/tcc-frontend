export interface Cidade {
    id_cidade: number;
    nome_cidade: string;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarCidade {
    nome_cidade: string;
}

export type RequisicaoAtualizarCidade = Partial<RequisicaoCriarCidade>;
