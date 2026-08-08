import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Consumidor,
    RequisicaoAtualizarConsumidor,
    RequisicaoCriarConsumidor,
} from "../types/consumidor.types";
import { RepositorioConsumidor } from "./repositorioConsumidor";

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

function mapConsumidorApi(item: ConsumidorApiResponse): Consumidor {
    return {
        id: item.id,
        cpf: item.cpf,
        pontos: item.pontos,
        nivel: item.nivel,
        sexoId: item.sexoId,
        lojistaId: item.lojistaId,
        usuarioId: item.usuarioId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioConsumidorApi: RepositorioConsumidor = {
    async listar(): Promise<Consumidor[]> {
        const response = await clienteHttp.get<ConsumidorApiResponse[]>("/consumidor");
        return response.data.map(mapConsumidorApi);
    },

    async buscarPorId(id: number): Promise<Consumidor | null> {
        const response = await clienteHttp.get<ConsumidorApiResponse>(
            `/consumidor/${id}`,
        );
        return mapConsumidorApi(response.data);
    },

    async criar(dados: RequisicaoCriarConsumidor): Promise<Consumidor> {
        const response = await clienteHttp.post<ConsumidorApiResponse>(
            "/consumidor",
            dados,
        );
        return mapConsumidorApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarConsumidor,
    ): Promise<Consumidor> {
        const response = await clienteHttp.put<ConsumidorApiResponse>(
            `/consumidor/${id}`,
            dados,
        );
        return mapConsumidorApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/consumidor/${id}`);
    },
};
