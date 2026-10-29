import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Campanha,
    EdicaoCampanha,
    RequisicaoAtualizarCampanha,
    RequisicaoCriarCampanha,
    RequisicaoReativarCampanha,
    SituacaoSorteioEdicao,
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
    ativa: boolean;
    edicao: number;
    totalTickets: number;
    sorteioId: number | null;
    periodoEncerrado: boolean;
    situacaoSorteio: SituacaoSorteioEdicao;
};

type EdicaoCampanhaApiResponse = Omit<EdicaoCampanha, "dataSorteio"> & {
    dataSorteio: string | null;
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
        ativa: item.ativa,
        edicao: item.edicao,
        totalTickets: item.totalTickets,
        sorteioId: item.sorteioId,
        periodoEncerrado: item.periodoEncerrado,
        situacaoSorteio: item.situacaoSorteio,
    };
}

function mapEdicaoApi(item: EdicaoCampanhaApiResponse): EdicaoCampanha {
    return {
        edicao: item.edicao,
        atual: item.atual,
        dataInicioCivil: item.dataInicioCivil,
        dataFimCivil: item.dataFimCivil,
        valorPorTicket: item.valorPorTicket,
        totalTickets: item.totalTickets,
        sorteioId: item.sorteioId,
        periodoEncerrado: item.periodoEncerrado,
        situacaoSorteio: item.situacaoSorteio,
        dataSorteio: item.dataSorteio ? new Date(item.dataSorteio) : null,
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

    async deletar(id: number, forcar = false): Promise<void> {
        await clienteHttp.delete(`/campanha/${id}`, forcar ? { params: { forcar: true } } : undefined);
    },

    async inativar(id: number): Promise<Campanha> {
        const response = await clienteHttp.patch<CampanhaApiResponse>(`/campanha/${id}/inativar`);
        return mapCampanhaApi(response.data);
    },

    async reativar(id: number, dados: RequisicaoReativarCampanha): Promise<Campanha> {
        const response = await clienteHttp.patch<CampanhaApiResponse>(
            `/campanha/${id}/reativar`,
            dados,
        );
        return mapCampanhaApi(response.data);
    },

    async listarEdicoes(id: number): Promise<EdicaoCampanha[]> {
        const response = await clienteHttp.get<EdicaoCampanhaApiResponse[]>(
            `/campanha/${id}/edicoes`,
        );
        return response.data.map(mapEdicaoApi);
    },
};
