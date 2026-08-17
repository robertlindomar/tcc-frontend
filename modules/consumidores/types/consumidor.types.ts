/**
 * Modelo alinhado ao contrato HTTP `/consumidor` (camelCase).
 * Não usar `id_consumidor` / `id_sexo` / `id_lojista` — stubs UML, não o contrato da API.
 *
 * GET /consumidor (LOJISTA) lista visitantes da missão sistema "Visitar loja".
 * Consumidor.lojistaId é legado e não entra nessa listagem.
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

export interface VisitanteLoja {
    id: number;
    nome: string;
    quantidadeVisitas: number;
    primeiraVisita: Date;
    ultimaVisita: Date;
}

export interface ListagemVisitantesLoja {
    consumidores: VisitanteLoja[];
    consumidoresUnicos: number;
    totalVisitas: number;
}

export interface RequisicaoCriarConsumidor {
    cpf: string;
    sexoId?: number | null;
}

export interface RequisicaoAtualizarConsumidor {
    cpf: string;
    sexoId?: number | null;
}
