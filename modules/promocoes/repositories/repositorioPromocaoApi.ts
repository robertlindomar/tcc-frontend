import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Promocao,
    RequisicaoAtualizarPromocao,
    RequisicaoCriarPromocao,
    StatusVigenciaPromocao,
} from "../types/promocao.types";
import { RepositorioPromocao } from "./repositorioPromocao";

type PromocaoApiResponse = {
    id: number;
    descricao: string | null;
    preco: number;
    produtoId: number;
    ativa: boolean;
    dataInicio: string;
    dataFim: string;
    statusVigencia: StatusVigenciaPromocao;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapPromocaoApi(item: PromocaoApiResponse): Promocao {
    return {
        id: item.id,
        descricao: item.descricao,
        preco: Number(item.preco),
        produtoId: item.produtoId,
        ativa: item.ativa,
        dataInicio: new Date(item.dataInicio),
        dataFim: new Date(item.dataFim),
        statusVigencia: item.statusVigencia,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioPromocaoApi: RepositorioPromocao = {
    async listar(): Promise<Promocao[]> {
        const response = await clienteHttp.get<PromocaoApiResponse[]>("/promocao");
        return response.data.map(mapPromocaoApi);
    },

    async buscarPorId(id: number): Promise<Promocao | null> {
        const response = await clienteHttp.get<PromocaoApiResponse>(`/promocao/${id}`);
        return mapPromocaoApi(response.data);
    },

    async criar(dados: RequisicaoCriarPromocao): Promise<Promocao> {
        const response = await clienteHttp.post<PromocaoApiResponse>("/promocao", dados);
        return mapPromocaoApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarPromocao,
    ): Promise<Promocao> {
        const response = await clienteHttp.put<PromocaoApiResponse>(
            `/promocao/${id}`,
            dados,
        );
        return mapPromocaoApi(response.data);
    },

    async desativar(id: number): Promise<Promocao> {
        const response = await clienteHttp.patch<PromocaoApiResponse>(
            `/promocao/${id}/desativar`,
        );
        return mapPromocaoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/promocao/${id}`);
    },
};
