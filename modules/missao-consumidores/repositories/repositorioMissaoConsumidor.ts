import {
    MissaoConsumidor,
    RequisicaoConcluirMissao,
    RespostaConcluirMissao,
} from "../types/missao-consumidor.types";

export interface RepositorioMissaoConsumidor {
    listar(): Promise<MissaoConsumidor[]>;
    concluir(dados: RequisicaoConcluirMissao): Promise<RespostaConcluirMissao>;
}
