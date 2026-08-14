import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    CatalogoRecompensa,
    Recompensa,
    RequisicaoAtualizarRecompensa,
    RequisicaoCriarRecompensa,
    ResgateRecompensa,
    RespostaResgatar,
} from "../types/recompensa.types";
import { RepositorioRecompensa } from "./repositorioRecompensa";

type RecompensaApi = {
    id: number;
    nome: string;
    descricao: string | null;
    custoPontos: number;
    ativa: boolean;
    lojistaId: number;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapRecompensa(item: RecompensaApi): Recompensa {
    return {
        ...item,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
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
            resgate: {
                id: number;
                recompensaId: number;
                consumidorId: number;
                custoPontosSnapshot: number;
                nomeRecompensaSnapshot: string;
                dataCriacao: string;
            };
            consumidor: { pontos: number; nivel: number };
        }>(`/recompensa/${id}/resgatar`, {});
        const r = response.data.resgate;
        return {
            resgate: {
                ...r,
                dataCriacao: new Date(r.dataCriacao),
            },
            consumidor: response.data.consumidor,
        } satisfies RespostaResgatar;
    },

    async listarResgates() {
        const response = await clienteHttp.get<
            {
                id: number;
                recompensaId: number;
                consumidorId: number;
                custoPontosSnapshot: number;
                nomeRecompensaSnapshot: string;
                dataCriacao: string;
            }[]
        >("/resgate-recompensa");
        return response.data.map(
            (item): ResgateRecompensa => ({
                ...item,
                dataCriacao: new Date(item.dataCriacao),
            }),
        );
    },
};
