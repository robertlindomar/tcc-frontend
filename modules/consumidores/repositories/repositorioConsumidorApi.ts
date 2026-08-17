import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Consumidor,
    ListagemVisitantesLoja,
    RequisicaoAtualizarConsumidor,
    RequisicaoCriarConsumidor,
    VisitanteLoja,
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

type VisitanteLojaApiResponse = {
    id: number;
    nome: string;
    quantidadeVisitas: number;
    primeiraVisita: string;
    ultimaVisita: string;
};

type ListagemVisitantesApiResponse = {
    consumidores: VisitanteLojaApiResponse[];
    consumidoresUnicos: number;
    totalVisitas: number;
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

function mapVisitanteApi(item: VisitanteLojaApiResponse): VisitanteLoja {
    return {
        id: item.id,
        nome: item.nome,
        quantidadeVisitas: item.quantidadeVisitas,
        primeiraVisita: new Date(item.primeiraVisita),
        ultimaVisita: new Date(item.ultimaVisita),
    };
}

export const repositorioConsumidorApi: RepositorioConsumidor = {
    async listar(): Promise<ListagemVisitantesLoja> {
        const response = await clienteHttp.get<ListagemVisitantesApiResponse>("/consumidor");
        const body = response.data;
        return {
            consumidores: body.consumidores.map(mapVisitanteApi),
            consumidoresUnicos: body.consumidoresUnicos,
            totalVisitas: body.totalVisitas,
        };
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
