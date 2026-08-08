import { RequisicaoCriarUsuario, Usuario } from "@/modules/usuarios/types/usuario.types";
import { RequisicaoLogin, RespostaLogin } from "../types/auth.types";

const CHAVE_USUARIOS = "usuarios_mock";
const CHAVE_USUARIO_LOGADO = "usuario_logado";

const usuariosIniciais: Usuario[] = [
    {
        id: 1,
        nome: "Robert",
        email: "robert@gmail.com",
        senha: "123456",
        role: "CONSUMIDOR",
        ativo: true,
        data_criacao: new Date(),
        data_atualizacao: new Date(),
    },
];

function removerSenha(usuario: Usuario): Omit<Usuario, "senha"> {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
        ativo: usuario.ativo,
        data_criacao: usuario.data_criacao,
        data_atualizacao: usuario.data_atualizacao,
    };
}

function carregarUsuarios(): Usuario[] {
    if (typeof window === "undefined") {
        return usuariosIniciais;
    }

    const dados = localStorage.getItem(CHAVE_USUARIOS);

    if (!dados) {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuariosIniciais));
        return usuariosIniciais;
    }

    const usuarios = JSON.parse(dados) as Usuario[];

    return usuarios.map((usuario) => ({
        ...usuario,
        data_criacao: new Date(usuario.data_criacao),
        data_atualizacao: new Date(usuario.data_atualizacao),
    }));
}

function salvarUsuarios(usuarios: Usuario[]) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

function gerarTokenMock(usuario: Usuario) {
    return `token_mock_${usuario.id}_${Date.now()}`;
}

export async function entrarMock(dados: RequisicaoLogin): Promise<RespostaLogin> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usuarios = carregarUsuarios();

    const usuario = usuarios.find(
        (usuario) =>
            usuario.email === dados.email &&
            usuario.senha === dados.senha &&
            usuario.ativo
    );

    if (!usuario) {
        throw new Error("Email ou senha inválidos.");
    }

    const resposta: RespostaLogin = {
        usuario: removerSenha(usuario),
        token: gerarTokenMock(usuario),
    };

    localStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(resposta));

    return resposta;
}

export async function cadastrarUsuarioMock(
    dado: RequisicaoCriarUsuario
): Promise<Omit<Usuario, "senha">> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const usuarios = carregarUsuarios();

    const emailJaExiste = usuarios.some((usuario) => usuario.email === dado.email);

    if (emailJaExiste) {
        throw new Error("Já existe um usuário cadastrado com este email.");
    }

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
    salvarUsuarios(usuarios);

    return removerSenha(novoUsuario);
}

export function buscarUsuarioLogado(): RespostaLogin | null {
    if (typeof window === "undefined") {
        return null;
    }

    const dado = localStorage.getItem(CHAVE_USUARIO_LOGADO);

    if (!dado) {
        return null;
    }

    return JSON.parse(dado) as RespostaLogin;
}

export function sairMock() {
    localStorage.removeItem(CHAVE_USUARIO_LOGADO);
}
