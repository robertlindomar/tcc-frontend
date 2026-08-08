export interface Bairro {
    id_bairro: number;
    nome_bairro: string;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarBairro {
    nome_bairro: string;
}

export type RequisicaoAtualizarBairro = Partial<RequisicaoCriarBairro>;
