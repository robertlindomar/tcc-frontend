import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    MissaoConsumidor,
    RequisicaoConcluirMissao,
    RespostaConcluirMissao,
} from "../types/missao-consumidor.types";
import { RepositorioMissaoConsumidor } from "./repositorioMissaoConsumidor";

type MissaoConsumidorApiResponse = {
    id: number;
    missaoId: number;
    consumidorId: number;
    nomeMissao: string;
    pontoRecompensa: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

type ConsumidorApiResponse = {
    id: number;
    cpf: string;
    pontos: number;
    nivel: number;
    sexoId: number | null;
    lojistaId: number | null;
    usuarioId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

type RespostaConcluirMissaoApi = {
    missaoConsumidor: MissaoConsumidorApiResponse;
    consumidor: ConsumidorApiResponse;
};

function mapMissaoConsumidorApi(
    item: MissaoConsumidorApiResponse,
): MissaoConsumidor {
    return {
        id: item.id,
        missaoId: item.missaoId,
        consumidorId: item.consumidorId,
        nomeMissao: item.nomeMissao,
        pontoRecompensa: item.pontoRecompensa,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

function mapRespostaConcluirMissaoApi(
    data: RespostaConcluirMissaoApi,
): RespostaConcluirMissao {
    return {
        missaoConsumidor: mapMissaoConsumidorApi(data.missaoConsumidor),
        consumidor: {
            id: data.consumidor.id,
            cpf: data.consumidor.cpf,
            pontos: data.consumidor.pontos,
            nivel: data.consumidor.nivel,
            sexoId: data.consumidor.sexoId,
            lojistaId: data.consumidor.lojistaId,
            usuarioId: data.consumidor.usuarioId,
            dataCriacao: new Date(data.consumidor.dataCriacao),
            dataAtualizacao: new Date(data.consumidor.dataAtualizacao),
        },
    };
}

export const repositorioMissaoConsumidorApi: RepositorioMissaoConsumidor = {
    async listar(): Promise<MissaoConsumidor[]> {
        const response =
            await clienteHttp.get<MissaoConsumidorApiResponse[]>(
                "/missao-consumidor",
            );
        return response.data.map(mapMissaoConsumidorApi);
    },

    async concluir(
        dados: RequisicaoConcluirMissao,
    ): Promise<RespostaConcluirMissao> {
        const response = await clienteHttp.post<RespostaConcluirMissaoApi>(
            "/missao-consumidor/concluir",
            dados,
        );
        return mapRespostaConcluirMissaoApi(response.data);
    },
};
