import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Evento,
    RequisicaoAtualizarEvento,
    RequisicaoCriarEvento,
} from "../types/evento.types";
import { RepositorioEvento } from "./repositorioEvento";

type EventoApiResponse = {
    id: number;
    nome: string;
    descricao: string | null;
    lojistaId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapEventoApi(item: EventoApiResponse): Evento {
    return {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        lojistaId: item.lojistaId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioEventoApi: RepositorioEvento = {
    async listar(): Promise<Evento[]> {
        const response = await clienteHttp.get<EventoApiResponse[]>("/evento");
        return response.data.map(mapEventoApi);
    },

    async buscarPorId(id: number): Promise<Evento | null> {
        const response = await clienteHttp.get<EventoApiResponse>(`/evento/${id}`);
        return mapEventoApi(response.data);
    },

    async criar(dados: RequisicaoCriarEvento): Promise<Evento> {
        const response = await clienteHttp.post<EventoApiResponse>("/evento", dados);
        return mapEventoApi(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarEvento): Promise<Evento> {
        const response = await clienteHttp.put<EventoApiResponse>(
            `/evento/${id}`,
            dados,
        );
        return mapEventoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/evento/${id}`);
    },
};
