/**
 * Modelo alinhado ao contrato HTTP `/missao-consumidor` (camelCase).
 * Não usar `missao_fk` / `consumidor_fk` — stubs UML, não o contrato da API.
 * `consumidorId` vem só do JWT no backend; o lab envia o payload/token do QR.
 */
export interface MissaoConsumidor {
    id: number;
    missaoId: number;
    consumidorId: number;
    nomeMissao: string;
    pontoRecompensa: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoConcluirMissao {
    tokenQr: string;
}

export interface RespostaConcluirMissao {
    missaoConsumidor: MissaoConsumidor;
    consumidor: {
        id: number;
        cpf: string;
        pontos: number;
        nivel: number;
        sexoId: number | null;
        lojistaId: number | null;
        usuarioId: number;
        dataCriacao: Date;
        dataAtualizacao: Date;
    };
}
