export interface Recompensa {
    id: number;
    nome: string;
    descricao: string | null;
    custoPontos: number;
    ativa: boolean;
    lojistaId: number;
    dataCriacao: Date;
    dataAtualizacao: Date;
}

export interface RequisicaoCriarRecompensa {
    nome: string;
    descricao?: string | null;
    custoPontos: number;
}

export interface RequisicaoAtualizarRecompensa {
    nome: string;
    descricao?: string | null;
    custoPontos: number;
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
    dataCriacao: Date;
}

export interface RespostaResgatar {
    resgate: ResgateRecompensa;
    consumidor: {
        pontos: number;
        nivel: number;
    };
}
