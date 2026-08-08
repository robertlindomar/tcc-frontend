import { usuariosMock } from "../mocks/usuarios.mock";
import { RequisicaoAtualizarUsuario, RequisicaoCriarUsuario, Usuario } from "../types/usuario.types";
import { RepositorioUsuario } from "./repositorioUsuario";

let usuarios = [...usuariosMock];

function simularDelay() {
    return new Promise((resolve) => setTimeout(resolve, 500));
}

export const repositorioUsuarioMock: RepositorioUsuario = {
    async listar(): Promise<Usuario[]> {
        await simularDelay();
        return usuarios;
    },

    async buscarPorId(id: number): Promise<Usuario | null> {
        await simularDelay();

        const usuario = usuarios.find((usuario) => usuario.id === id);

        return usuario ?? null;
    },

    async criar(dado: RequisicaoCriarUsuario): Promise<Usuario> {
        await simularDelay();

        const novoUsuario: Usuario = {
            id: usuarios.length + 1,
            nome: dado.nome,
            email: dado.email,
            senha: dado.senha,
            role: dado.role,
            ativo: true,
            data_criacao: new Date(),
            data_atualizacao: new Date(),
        };

        usuarios.push(novoUsuario);

        return novoUsuario;
    },

    async atualizar(id: number, dados: RequisicaoAtualizarUsuario): Promise<Usuario> {
        await simularDelay();

        const usuario = usuarios.find((item) => item.id === id);

        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }

        usuario.nome = dados.nome;
        usuario.email = dados.email;
        usuario.data_atualizacao = new Date();

        return usuario;
    },

    async deletar(id: number): Promise<void> {
        await simularDelay();

        usuarios = usuarios.filter((usuario) => usuario.id !== id);
    },
};
