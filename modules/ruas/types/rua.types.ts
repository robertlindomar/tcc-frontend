export interface Rua {
    id_rua: number;
    nome_rua: string;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarRua {
    nome_rua: string;
}

export type RequisicaoAtualizarRua = Partial<RequisicaoCriarRua>;
