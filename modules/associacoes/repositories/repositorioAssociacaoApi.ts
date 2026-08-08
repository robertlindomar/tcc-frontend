import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Associacao,
    RequisicaoAtualizarAssociacao,
    RequisicaoCriarAssociacao,
} from "../types/associacao.types";
import { RepositorioAssociacao } from "./repositorioAssociacao";

type AssociacaoApiResponse = {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: number | null;
    usuarioId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapAssociacaoApi(item: AssociacaoApiResponse): Associacao {
    return {
        id: item.id,
        nomeFantasia: item.nomeFantasia,
        razaoSocial: item.razaoSocial,
        cnpj: item.cnpj,
        inscricaoEstadual: item.inscricaoEstadual,
        usuarioId: item.usuarioId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioAssociacaoApi: RepositorioAssociacao = {
    async listar(): Promise<Associacao[]> {
        const response = await clienteHttp.get<AssociacaoApiResponse[]>("/associacao");
        return response.data.map(mapAssociacaoApi);
    },

    async buscarPorId(id: number): Promise<Associacao | null> {
        const response = await clienteHttp.get<AssociacaoApiResponse>(
            `/associacao/${id}`,
        );
        return mapAssociacaoApi(response.data);
    },

    async criar(dados: RequisicaoCriarAssociacao): Promise<Associacao> {
        const response = await clienteHttp.post<AssociacaoApiResponse>(
            "/associacao",
            dados,
        );
        return mapAssociacaoApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarAssociacao,
    ): Promise<Associacao> {
        const response = await clienteHttp.put<AssociacaoApiResponse>(
            `/associacao/${id}`,
            dados,
        );
        return mapAssociacaoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/associacao/${id}`);
    },
};
