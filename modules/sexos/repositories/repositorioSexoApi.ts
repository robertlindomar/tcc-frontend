import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoAtualizarSexo,
    RequisicaoCriarSexo,
    Sexo,
} from "../types/sexo.types";
import { RepositorioSexo } from "./repositorioSexo";

type SexoApiResponse = {
    id: number;
    nome: string;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapSexoApi(sexo: SexoApiResponse): Sexo {
    return {
        id: sexo.id,
        nome: sexo.nome,
        dataCriacao: new Date(sexo.dataCriacao),
        dataAtualizacao: new Date(sexo.dataAtualizacao),
    };
}

export const repositorioSexoApi: RepositorioSexo = {
    async listar(): Promise<Sexo[]> {
        const response = await clienteHttp.get<SexoApiResponse[]>("/sexo");
        return response.data.map(mapSexoApi);
    },

    async buscarPorId(id: number): Promise<Sexo | null> {
        const response = await clienteHttp.get<SexoApiResponse>(`/sexo/${id}`);
        return mapSexoApi(response.data);
    },

    async criar(dados: RequisicaoCriarSexo): Promise<Sexo> {
        const response = await clienteHttp.post<SexoApiResponse>("/sexo", {
            nome: dados.nome,
        });
        return mapSexoApi(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarSexo): Promise<Sexo> {
        const response = await clienteHttp.put<SexoApiResponse>(
            `/sexo/${id}`,
            dados,
        );
        return mapSexoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/sexo/${id}`);
    },
};
