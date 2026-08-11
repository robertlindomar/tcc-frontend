export type PapelUsuario = "ASSOCIACAO" | "LOJISTA" | "CONSUMIDOR";

/**
 * Modelo de domínio usado pela UI.
 * Datas no cliente: `data_criacao` / `data_atualizacao`.
 * A API responde `dataCriacao` / `dataAtualizacao` — mapear nos repositories/services.
 */
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha?: string;
    role: PapelUsuario;
    ativo: boolean;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarUsuario {
    nome: string;
    email: string;
    senha: string;
    role: PapelUsuario;
}

export interface RequisicaoAtualizarUsuario {
    nome: string;
    email: string;
}

/** Stub UML (módulos futuros) — não é o contrato HTTP atual. */
export interface UsuarioApiUml {
    id_usuario: number;
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
    role_usuario: PapelUsuario;
    data_criacao: Date;
    data_atualizacao: Date;
}

export interface RequisicaoCriarUsuarioUml {
    nome_usuario: string;
    email_usuario: string;
    senha_usuario: string;
    role_usuario: PapelUsuario;
}

export type RequisicaoAtualizarUsuarioUml = Partial<RequisicaoCriarUsuarioUml>;
