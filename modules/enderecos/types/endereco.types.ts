/**
 * Modelo alinhado ao contrato HTTP `/endereco` (camelCase).
 * O cliente envia apenas CEP e número: rua, bairro, cidade e estado são
 * resolvidos pela API via ViaCEP. O dono vem do JWT, nunca do payload.
 */
export interface LocalidadeEndereco {
    id: number;
    nome: string;
}

export interface EstadoEndereco extends LocalidadeEndereco {
    uf: string;
}

export interface Endereco {
    id: number;
    cep: string;
    numero: string | null;
    usuarioId: number;
    rua: LocalidadeEndereco;
    bairro: LocalidadeEndereco;
    cidade: LocalidadeEndereco;
    estado: EstadoEndereco;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarEndereco {
    cep: string;
    numero?: string | null;
}

export interface RequisicaoAtualizarEndereco {
    cep?: string;
    numero?: string;
}
