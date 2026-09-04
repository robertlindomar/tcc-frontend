export type SituacaoRecompensa = "DISPONIVEL" | "DESATIVADA" | "EXPIRADA" | "ESGOTADA";

export type StatusResgateRecompensa = "PENDENTE_ENTREGA" | "ENTREGUE" | "RECUSADO";

export interface Recompensa {
    id: number;
    nome: string;
    descricao: string | null;
    custoPontos: number;
    ativa: boolean;
    estoque: number | null;
    dataFim: Date | null;
    dataFimCivil: string | null;
    situacao: SituacaoRecompensa;
    lojistaId: number;
    nomeLoja?: string | null;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarRecompensa {
    nome: string;
    descricao?: string | null;
    custoPontos: number;
    estoque?: number | null;
    dataFim?: string | null;
}

export interface RequisicaoAtualizarRecompensa {
    nome: string;
    descricao?: string | null;
    custoPontos: number;
    estoque?: number | null;
    dataFim?: string | null;
}

export interface CatalogoRecompensa {
    pontos: number;
    nivel: number;
    recompensas: Recompensa[];
}

export interface ResgateRecompensa {
    id: number;
    recompensaId: number;
    consumidorId: number;
    custoPontosSnapshot: number;
    nomeRecompensaSnapshot: string;
    status: StatusResgateRecompensa;
    dataEntrega: Date | null;
    dataCriacao: Date;
    nomeConsumidor?: string | null;
}

export interface RespostaResgatar {
    resgate: ResgateRecompensa;
    consumidor: {
        pontos: number;
        nivel: number;
    };
}
