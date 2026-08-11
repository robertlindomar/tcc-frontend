import { clienteHttp } from "@/shared/services/clienteHttp";
import {
    RequisicaoAtualizarUsuario,
    RequisicaoCriarUsuario,
    Usuario,
    PapelUsuario,
} from "../types/usuario.types";
import { RepositorioUsuario } from "./repositorioUsuario";

type UsuarioApiResponse = {
    id: number;
    nome: string;
    email: string;
    role: PapelUsuario;
    ativo: boolean;
    dataCriacao: string;
    dataAtualizacao: string;
};

function mapUsuarioApi(usuario: UsuarioApiResponse): Usuario {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: "",
        role: usuario.role,
        ativo: usuario.ativo,
        data_criacao: new Date(usuario.dataCriacao),
        data_atualizacao: new Date(usuario.dataAtualizacao),
    };
}

export const repositorioUsuarioApi: RepositorioUsuario = {
    async listar(): Promise<Usuario[]> {
        const response = await clienteHttp.get<UsuarioApiResponse[]>("/usuario");
        return response.data.map(mapUsuarioApi);
    },

    async buscarPorId(id: number): Promise<Usuario | null> {
        const response = await clienteHttp.get<UsuarioApiResponse>(`/usuario/${id}`);
        return mapUsuarioApi(response.data);
    },

    async criar(dados: RequisicaoCriarUsuario): Promise<Usuario> {
        const response = await clienteHttp.post<UsuarioApiResponse>("/usuario", {
            nome: dados.nome,
            email: dados.email,
            senha: dados.senha,
            role: dados.role,
        });
        return mapUsuarioApi(response.data);
    },

    async atualizar(id: number, dados: RequisicaoAtualizarUsuario): Promise<Usuario> {
        const response = await clienteHttp.put<UsuarioApiResponse>(`/usuario/${id}`, dados);
        return mapUsuarioApi(response.data);
    },

    async deletar(id: number): Promise<void> {
        await clienteHttp.delete(`/usuario/${id}`);
    },
};
