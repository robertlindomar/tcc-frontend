/**
 * Modelo alinhado ao contrato HTTP `/consumidor` (camelCase).
 * Não usar `id_consumidor` / `id_sexo` / `id_lojista` — stubs UML, não o contrato da API.
 */
export interface Consumidor {
    id: number;
    cpf: string;
    pontos: number;
    nivel: number;
    sexoId: number | null;
    lojistaId: number | null;
    usuarioId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarConsumidor {
    cpf: string;
    sexoId?: number | null;
    lojistaId?: number | null;
}

export interface RequisicaoAtualizarConsumidor {
    cpf: string;
    sexoId?: number | null;
    lojistaId?: number | null;
}
