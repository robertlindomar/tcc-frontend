import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoAtualizarSorteio,
    RequisicaoCriarSorteio,
    Sorteio,
} from "../types/sorteio.types";
import { RepositorioSorteio } from "./repositorioSorteio";

type SorteioApiResponse = {
    id: number;
    qrcode: string | null;
    campanhaId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapSorteioApi(item: SorteioApiResponse): Sorteio {
    return {
        id: item.id,
        qrcode: item.qrcode,
        campanhaId: item.campanhaId,
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
};
