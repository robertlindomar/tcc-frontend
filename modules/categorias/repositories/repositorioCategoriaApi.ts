import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoAtualizarCategoria,
    RequisicaoCriarCategoria,
    Categoria,
} from "../types/categoria.types";
import { RepositorioCategoria } from "./repositorioCategoria";

type CategoriaApiResponse = {
    id: number;
    nome: string;
    lojistaId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapCategoriaApi(item: CategoriaApiResponse): Categoria {
    return {
        id: item.id,
        nome: item.nome,
        lojistaId: item.lojistaId,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioCategoriaApi: RepositorioCategoria = {
    async listar(): Promise<Categoria[]> {
        const response = await clienteHttp.get<CategoriaApiResponse[]>("/categoria");
        return response.data.map(mapCategoriaApi);
    },

    async buscarPorId(id: number): Promise<Categoria | null> {
        const response = await clienteHttp.get<CategoriaApiResponse>(`/categoria/${id}`);
        return mapCategoriaApi(response.data);
    },

    async criar(dados: RequisicaoCriarCategoria): Promise<Categoria> {
        const response = await clienteHttp.post<CategoriaApiResponse>("/categoria", {
            nome: dados.nome,
        });
        return mapCategoriaApi(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarCategoria): Promise<Categoria> {
        const response = await clienteHttp.put<CategoriaApiResponse>(
            `/categoria/${id}`,
            dados,
        );
        return mapCategoriaApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/categoria/${id}`);
    },
};
