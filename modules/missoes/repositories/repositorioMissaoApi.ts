import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    FrequenciaMissao,
    Missao,
    RequisicaoAtualizarMissao,
    RequisicaoCriarMissao,
} from "../types/missao.types";
import { RepositorioMissao } from "./repositorioMissao";

type MissaoApiResponse = {
    id: number;
    nome: string;
    descricao: string | null;
    pontoRecompensa: number;
    frequencia: FrequenciaMissao;
    dataFim: string | null;
    dataFimCivil: string | null;
    expirada: boolean;
    sistema: boolean;
    lojistaId: number;
    tokenQr: string;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapMissaoApi(item: MissaoApiResponse): Missao {
    return {
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        pontoRecompensa: item.pontoRecompensa,
        frequencia: item.frequencia,
        dataFim: item.dataFim ? new Date(item.dataFim) : null,
        dataFimCivil: item.dataFimCivil,
        expirada: item.expirada,
        sistema: item.sistema,
        lojistaId: item.lojistaId,
        tokenQr: item.tokenQr,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioMissaoApi: RepositorioMissao = {
    async listar(): Promise<Missao[]> {
        const response = await clienteHttp.get<MissaoApiResponse[]>("/missao");
        return response.data.map(mapMissaoApi);
    },

    async buscarPorId(id: number): Promise<Missao | null> {
        const response = await clienteHttp.get<MissaoApiResponse>(`/missao/${id}`);
        return mapMissaoApi(response.data);
    },

    async criar(dados: RequisicaoCriarMissao): Promise<Missao> {
        const response = await clienteHttp.post<MissaoApiResponse>("/missao", dados);
        return mapMissaoApi(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarMissao): Promise<Missao> {
        const response = await clienteHttp.put<MissaoApiResponse>(
            `/missao/${id}`,
            dados,
        );
        return mapMissaoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/missao/${id}`);
    },
};
