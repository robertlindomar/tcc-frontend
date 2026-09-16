import axios from "axios";
import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    Endereco,
    RequisicaoAtualizarEndereco,
    RequisicaoCriarEndereco,
} from "../types/endereco.types";
import { RepositorioEndereco } from "./repositorioEndereco";

type EnderecoApiResponse = {
    id: number;
    cep: string;
    numero: string | null;
    latitude: number | null;
    longitude: number | null;
    usuarioId: number;
    rua: { id: number; nome: string };
    bairro: { id: number; nome: string };
    cidade: { id: number; nome: string };
    estado: { id: number; nome: string; uf: string };
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapEnderecoApi(item: EnderecoApiResponse): Endereco {
    return {
        id: item.id,
        cep: item.cep,
        numero: item.numero,
        latitude: item.latitude,
        longitude: item.longitude,
        usuarioId: item.usuarioId,
        rua: item.rua,
        bairro: item.bairro,
        cidade: item.cidade,
        estado: item.estado,
        dataCriacao: new Date(item.dataCriacao),
        dataAtualizacao: new Date(item.dataAtualizacao),
    };
}

export const repositorioEnderecoApi: RepositorioEndereco = {
    async buscarPorUsuario(usuarioId: number): Promise<Endereco | null> {
        try {
            const response = await clienteHttp.get<EnderecoApiResponse>(
                `/endereco/usuario/${usuarioId}`,
            );
            return mapEnderecoApi(response.data);
        } catch (error) {
            // "Ainda não cadastrou" não é falha: a tela oferece o cadastro.
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    async criar(dados: RequisicaoCriarEndereco): Promise<Endereco> {
        const response = await clienteHttp.post<EnderecoApiResponse>("/endereco", {
            cep: dados.cep,
            numero: dados.numero,
            latitude: dados.latitude,
            longitude: dados.longitude,
        });
        return mapEnderecoApi(response.data);
    },

    async atualizar(
        id: number,
        dados: RequisicaoAtualizarEndereco,
    ): Promise<Endereco> {
        const response = await clienteHttp.put<EnderecoApiResponse>(
            `/endereco/${id}`,
            dados,
        );
        return mapEnderecoApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/endereco/${id}`);
    },
};
