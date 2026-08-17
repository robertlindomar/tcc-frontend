import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    CatalogoRecompensa,
    Recompensa,
    RequisicaoAtualizarRecompensa,
    RequisicaoCriarRecompensa,
    ResgateRecompensa,
    RespostaResgatar,
    SituacaoRecompensa,
    StatusResgateRecompensa,
} from "../types/recompensa.types";
import { RepositorioRecompensa } from "./repositorioRecompensa";

type RecompensaApi = {
    id: number;
    nome: string;
    descricao: string | null;
    custoPontos: number;
    ativa: boolean;
    estoque: number | null;
    dataFim: string | null;
    dataFimCivil: string | null;
    situacao: SituacaoRecompensa;
    lojistaId: number;
    nomeLoja?: string | null;
    dataCriacao: string;
    dataAtualizacao: string;
};

type ResgateApi = {
    id: number;
    recompensaId: number;
    consumidorId: number;
    custoPontosSnapshot: number;
    nomeRecompensaSnapshot: string;
    status: StatusResgateRecompensa;
    dataEntrega: string | null;
    dataCriacao: string;
    nomeConsumidor?: string | null;
};

function mapRecompensa(item: RecompensaApi): Recompensa {
    return {
        ...item,
        dataFim: item.dataFim ? new Date(item.dataFim) : null,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

function mapResgate(item: ResgateApi): ResgateRecompensa {
    return {
        ...item,
        dataEntrega: item.dataEntrega ? new Date(item.dataEntrega) : null,
        dataCriacao: new Date(item.dataCriacao),
    };
}

export const repositorioRecompensaApi: RepositorioRecompensa = {
    async listar() {
        const response = await clienteHttp.get<RecompensaApi[]>("/recompensa");
        return response.data.map(mapRecompensa);
    },

    async criar(dados: RequisicaoCriarRecompensa) {
        const response = await clienteHttp.post<RecompensaApi>("/recompensa", dados);
        return mapRecompensa(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarRecompensa) {
        const response = await clienteHttp.put<RecompensaApi>(`/recompensa/${id}`, dados);
        return mapRecompensa(response.data);
    },

    async desativar(id: number) {
        const response = await clienteHttp.patch<RecompensaApi>(
            `/recompensa/${id}/desativar`,
        );
        return mapRecompensa(response.data);
    },

    async deletar(id: number) {
        await clienteHttp.delete(`/recompensa/${id}`);
    },

    async catalogo() {
        const response = await clienteHttp.get<{
            pontos: number;
            nivel: number;
            recompensas: RecompensaApi[];
        }>("/recompensa/catalogo");
        return {
            pontos: response.data.pontos,
            nivel: response.data.nivel,
            recompensas: response.data.recompensas.map(mapRecompensa),
        } satisfies CatalogoRecompensa;
    },

    async resgatar(id: number) {
        const response = await clienteHttp.post<{
            resgate: ResgateApi;
            consumidor: { pontos: number; nivel: number };
        }>(`/recompensa/${id}/resgatar`, {});
        return {
            resgate: mapResgate(response.data.resgate),
            consumidor: response.data.consumidor,
        } satisfies RespostaResgatar;
    },

    async listarResgates() {
        const response = await clienteHttp.get<ResgateApi[]>("/resgate-recompensa");
        return response.data.map(mapResgate);
    },

    async listarResgatesLoja() {
        const response = await clienteHttp.get<ResgateApi[]>("/resgate-recompensa/loja");
        return response.data.map(mapResgate);
    },

    async confirmarEntrega(id: number) {
        const response = await clienteHttp.patch<ResgateApi>(
            `/resgate-recompensa/${id}/confirmar-entrega`,
        );
        return mapResgate(response.data);
    },
};
