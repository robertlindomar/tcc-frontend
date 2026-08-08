import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Produto,
    RequisicaoAtualizarProduto,
    RequisicaoCriarProduto,
} from "../types/produto.types";
import { RepositorioProduto } from "./repositorioProduto";

type ProdutoApiResponse = {
    id: number;
    nome: string;
    valor: number;
    categoriaId: number | null;
    lojistaId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapProdutoApi(item: ProdutoApiResponse): Produto {
    return {
        id: item.id,
        nome: item.nome,
        valor: Number(item.valor),
        categoriaId: item.categoriaId,
        lojistaId: item.lojistaId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioProdutoApi: RepositorioProduto = {
    async listar(): Promise<Produto[]> {
        const response = await clienteHttp.get<ProdutoApiResponse[]>("/produto");
        return response.data.map(mapProdutoApi);
    },

    async buscarPorId(id: number): Promise<Produto | null> {
        const response = await clienteHttp.get<ProdutoApiResponse>(`/produto/${id}`);
        return mapProdutoApi(response.data);
    },

    async criar(dados: RequisicaoCriarProduto): Promise<Produto> {
        const response = await clienteHttp.post<ProdutoApiResponse>("/produto", dados);
        return mapProdutoApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarProduto,
    ): Promise<Produto> {
        const response = await clienteHttp.put<ProdutoApiResponse>(
            `/produto/${id}`,
            dados,
        );
        return mapProdutoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/produto/${id}`);
    },
};
