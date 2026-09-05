import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Campanha,
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
} from "../types/campanha.types";
import { RepositorioCampanha } from "./repositorioCampanha";

type CampanhaApiResponse = {
    id: number;
    nome: string;
    descricao: string | null;
    qrcode: string | null;
    dataInicio: string;
    dataFim: string;
    dataInicioCivil: string;
    dataFimCivil: string;
    valorPorTicket: number;
    associacaoId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapCampanhaApi(item: CampanhaApiResponse): Campanha {
    return {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        qrcode: item.qrcode,
        dataInicio: new Date(item.dataInicio),
        dataFim: new Date(item.dataFim),
        dataInicioCivil: item.dataInicioCivil,
        dataFimCivil: item.dataFimCivil,
        valorPorTicket: item.valorPorTicket,
        associacaoId: item.associacaoId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioCampanhaApi: RepositorioCampanha = {
    async listar(): Promise<Campanha[]> {
        const response = await clienteHttp.get<CampanhaApiResponse[]>("/campanha");
        return response.data.map(mapCampanhaApi);
    },

    async buscarPorId(id: number): Promise<Campanha | null> {
        const response = await clienteHttp.get<CampanhaApiResponse>(`/campanha/${id}`);
        return mapCampanhaApi(response.data);
    },

    async criar(dados: RequisicaoCriarCampanha): Promise<Campanha> {
        const response = await clienteHttp.post<CampanhaApiResponse>("/campanha", dados);
        return mapCampanhaApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarCampanha,
    ): Promise<Campanha> {
        const response = await clienteHttp.put<CampanhaApiResponse>(
            `/campanha/${id}`,
            dados,
        );
        return mapCampanhaApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/campanha/${id}`);
    },
};
