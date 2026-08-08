export interface Estado {
    id_estado: number;
    nome_estado: string;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarEstado {
    nome_estado: string;
}

export type RequisicaoAtualizarEstado = Partial<RequisicaoCriarEstado>;
