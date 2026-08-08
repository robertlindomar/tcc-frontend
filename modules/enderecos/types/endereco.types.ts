export interface Endereco {
    id_endereco: number;
    estado_fk: number;
    cidade_fk: number;
    bairro_fk: number;
    rua_fk: number;
    cep_endereco: number;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarEndereco {
    estado_fk: number;
    cidade_fk: number;
    bairro_fk: number;
    rua_fk: number;
    cep_endereco: number;
}

export type RequisicaoAtualizarEndereco = Partial<RequisicaoCriarEndereco>;
