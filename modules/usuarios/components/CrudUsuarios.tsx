"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarUsuario,
    criarUsuario,
    deletarUsuario,
    listarUsuarios,
} from "../services/servicoUsuario";
import { Usuario, PapelUsuario } from "../types/usuario.types";
import { TabelaUsuarios } from "./TabelaUsuarios";

const roles: Array<{ value: PapelUsuario; label: string }> = [
    { value: "CONSUMIDOR", label: "Consumidor" },
    { value: "LOJISTA", label: "Lojista" },
    { value: "ASSOCIACAO", label: "Associação" },
];

type FormState = {
    nome: string;
    email: string;
    senha: string;
    role: PapelUsuario;
};

const formInicial: FormState = {
    nome: "",
    email: "",
    senha: "",
    role: "CONSUMIDOR",
};

export function CrudUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
    const [usuarioExcluindo, setUsuarioExcluindo] = useState<Usuario | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (usuarioEditando ? "Editar usuário" : "Novo usuário"),
        [usuarioEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarUsuarios()
            .then((lista) => {
                if (!cancelado) {
                    setUsuarios(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar usuários."));
                }
            })
            .finally(() => {
                if (!cancelado) {
                    setCarregando(false);
                }
            });

        return () => {
            cancelado = true;
        };
    }, []);

    function abrirCriacao() {
        setUsuarioEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(usuario: Usuario) {
        setUsuarioEditando(usuario);
        setForm({
            nome: usuario.nome,
            email: usuario.email,
            senha: "",
            role: usuario.role,
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setUsuarioEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        if (!usuarioEditando && form.senha.length < 6) {
            setErro("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        setSalvando(true);

        try {
            if (usuarioEditando) {
                const atualizado = await atualizarUsuario(usuarioEditando.id, {
                    nome: form.nome,
                    email: form.email,
                });

                setUsuarios((lista) =>
                    lista.map((usuario) =>
                        usuario.id === atualizado.id ? atualizado : usuario,
                    ),
                );
            } else {
                const criado = await criarUsuario({
                    nome: form.nome,
                    email: form.email,
                    senha: form.senha,
                    role: form.role,
                });

                setUsuarios((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar usuário."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!usuarioExcluindo) {
            return;
        }

        setExcluindoId(usuarioExcluindo.id);
        setErro("");

        try {
            await deletarUsuario(usuarioExcluindo.id);
            setUsuarios((lista) =>
                lista.filter((usuario) => usuario.id !== usuarioExcluindo.id),
            );
            setUsuarioExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir usuário."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Usuários</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de usuários.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Novo usuário
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaUsuarios
                    usuarios={usuarios}
                    onEditar={abrirEdicao}
                    onExcluir={setUsuarioExcluindo}
                    carregando={carregando}
                    excluindoId={excluindoId}
                />
            </div>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {tituloModal}
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {usuarioEditando
                                        ? "Altere os dados básicos do usuário."
                                        : "Informe os dados para cadastrar um novo usuário."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharModal}
                                className="px-2 py-1 text-2xl leading-none text-slate-500 hover:text-slate-900"
                                aria-label="Fechar modal"
                            >
                                x
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Nome
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            nome: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Email
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            email: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            {!usuarioEditando && (
                                <>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Senha
                                        <input
                                            type="password"
                                            value={form.senha}
                                            onChange={(event) =>
                                                setForm((atual) => ({
                                                    ...atual,
                                                    senha: event.target.value,
                                                }))
                                            }
                                            className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                            required
                                            minLength={6}
                                        />
                                    </label>

                                    <label className="block text-sm font-medium text-slate-700">
                                        Perfil
                                        <select
                                            value={form.role}
                                            onChange={(event) =>
                                                setForm((atual) => ({
                                                    ...atual,
                                                    role: event.target.value as PapelUsuario,
                                                }))
                                            }
                                            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                        >
                                            {roles.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    disabled={salvando}
                                    className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {usuarioExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir usuário
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {usuarioExcluindo.nome}? Essa ação não
                            poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setUsuarioExcluindo(null)}
                                disabled={excluindoId !== null}
                                className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarExclusao}
                                disabled={excluindoId !== null}
                                className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {excluindoId ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
