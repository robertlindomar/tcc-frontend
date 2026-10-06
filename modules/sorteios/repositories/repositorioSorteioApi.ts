import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoAtualizarSorteio,
    RequisicaoCriarSorteio,
    ResultadoSorteio,
    SituacaoResultadoSorteio,
    Sorteio,
} from "../types/sorteio.types";
import { RepositorioSorteio } from "./repositorioSorteio";

type ResultadoSorteioApiResponse = {
    id: number;
    numeroSorteado: number;
    totalTickets: number;
    situacao: SituacaoResultadoSorteio;
    dataSorteio: string;
    dataAtualizacao: string;
    vencedor: ResultadoSorteio["vencedor"];
};

type SorteioApiResponse = {
    id: number;
    qrcode: string | null;
    campanhaId: number;
    totalTickets: number;
    campanhaEncerrada: boolean;
    resultadoAtual: ResultadoSorteioApiResponse | null;
    historico: ResultadoSorteioApiResponse[];
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapResultadoApi(item: ResultadoSorteioApiResponse): ResultadoSorteio {
    return {
        id: item.id,
        numeroSorteado: item.numeroSorteado,
        totalTickets: item.totalTickets,
        situacao: item.situacao,
        dataSorteio: new Date(item.dataSorteio),
        dataAtualizacao: new Date(item.dataAtualizacao),
        vencedor: item.vencedor,
    };
}

function mapSorteioApi(item: SorteioApiResponse): Sorteio {
    return {
        id: item.id,
        qrcode: item.qrcode,
        campanhaId: item.campanhaId,
        totalTickets: item.totalTickets,
        campanhaEncerrada: item.campanhaEncerrada,
        resultadoAtual: item.resultadoAtual ? mapResultadoApi(item.resultadoAtual) : null,
        historico: item.historico.map(mapResultadoApi),
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioSorteioApi: RepositorioSorteio = {
    async listar(): Promise<Sorteio[]> {
        const response = await clienteHttp.get<SorteioApiResponse[]>("/sorteio");
        return response.data.map(mapSorteioApi);
    },

    async buscarPorId(id: number): Promise<Sorteio | null> {
        const response = await clienteHttp.get<SorteioApiResponse>(`/sorteio/${id}`);
        return mapSorteioApi(response.data);
    },

    async criar(dados: RequisicaoCriarSorteio): Promise<Sorteio> {
        const response = await clienteHttp.post<SorteioApiResponse>("/sorteio", dados);
        return mapSorteioApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarSorteio,
    ): Promise<Sorteio> {
        const response = await clienteHttp.put<SorteioApiResponse>(
            `/sorteio/${id}`,
            dados,
        );
        return mapSorteioApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/sorteio/${id}`);
    },

    async sortear(id: number): Promise<Sorteio> {
        const response = await clienteHttp.post<SorteioApiResponse>(`/sorteio/${id}/sortear`);
        return mapSorteioApi(response.data);
    },

    async refazer(id: number): Promise<Sorteio> {
        const response = await clienteHttp.post<SorteioApiResponse>(`/sorteio/${id}/refazer`);
        return mapSorteioApi(response.data);
    },

    async confirmarEntrega(id: number): Promise<Sorteio> {
        const response = await clienteHttp.patch<SorteioApiResponse>(
            `/sorteio/${id}/confirmar-entrega`,
        );
        return mapSorteioApi(response.data);
    },
};
