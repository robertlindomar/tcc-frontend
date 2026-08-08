import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    FiltroListarLojista,
    Lojista,
    RequisicaoAtualizarLojista,
    RequisicaoCriarLojista,
    StatusLojista,
} from "../types/lojista.types";
import { RepositorioLojista } from "./repositorioLojista";

type LojistaApiResponse = {
    id: number;
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: number | null;
    status: StatusLojista;
    usuarioId: number;
    associacaoId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapLojistaApi(item: LojistaApiResponse): Lojista {
    return {
        id: item.id,
        nomeFantasia: item.nomeFantasia,
        razaoSocial: item.razaoSocial,
        cnpj: item.cnpj,
        inscricaoEstadual: item.inscricaoEstadual,
        status: item.status,
        usuarioId: item.usuarioId,
        associacaoId: item.associacaoId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioLojistaApi: RepositorioLojista = {
    async listar(filtro?: FiltroListarLojista): Promise<Lojista[]> {
        const response = await clienteHttp.get<LojistaApiResponse[]>("/lojista", {
            params: filtro?.status ? { status: filtro.status } : undefined,
        });
        return response.data.map(mapLojistaApi);
    },

    async buscarPorId(id: number): Promise<Lojista | null> {
        const response = await clienteHttp.get<LojistaApiResponse>(`/lojista/${id}`);
        return mapLojistaApi(response.data);
    },

    async criar(dados: RequisicaoCriarLojista): Promise<Lojista> {
        const response = await clienteHttp.post<LojistaApiResponse>("/lojista", dados);
        return mapLojistaApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarLojista,
    ): Promise<Lojista> {
        const response = await clienteHttp.put<LojistaApiResponse>(
            `/lojista/${id}`,
            dados,
        );
        return mapLojistaApi(response.data);
    },

    async aprovar(id: number): Promise<Lojista> {
        const response = await clienteHttp.patch<LojistaApiResponse>(
            `/lojista/${id}/aprovar`,
        );
        return mapLojistaApi(response.data);
    },

    async rejeitar(id: number): Promise<Lojista> {
        const response = await clienteHttp.patch<LojistaApiResponse>(
            `/lojista/${id}/rejeitar`,
        );
        return mapLojistaApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/lojista/${id}`);
    },
};
