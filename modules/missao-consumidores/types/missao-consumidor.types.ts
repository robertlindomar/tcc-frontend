export interface MissaoConsumidor {
    id_missao_consumidor: number;
    missao_fk: number;
    consumidor_fk: number;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarMissaoConsumidor {
    missao_fk: number;
    consumidor_fk: number;
}

export type RequisicaoAtualizarMissaoConsumidor = Partial<RequisicaoCriarMissaoConsumidor>;
