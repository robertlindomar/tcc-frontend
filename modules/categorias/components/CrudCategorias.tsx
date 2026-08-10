"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarCategoria,
    criarCategoria,
    deletarCategoria,
    listarCategorias,
} from "../services/servicoCategoria";
import { Categoria } from "../types/categoria.types";

export function CrudCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<Categoria | null>(null);
    const [excluindo, setExcluindo] = useState<Categoria | null>(null);
    const [nome, setNome] = useState("");

    const tituloModal = useMemo(
        () => (editando ? "Editar categoria" : "Nova categoria"),
        [editando],
    );

    useEffect(() => {
        let cancelado = false;
        listarCategorias()
            .then((lista) => {
                if (!cancelado) setCategorias(lista);
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar categorias."));
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    function abrirCriacao() {
        setEditando(null);
        setNome("");
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(item: Categoria) {
        setEditando(item);
        setNome(item.nome);
        setErro("");
        setModalAberto(true);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setErro("");
        setSalvando(true);
        try {
            if (editando) {
                const atualizado = await atualizarCategoria(editando.id, { nome });
                setCategorias((lista) =>
                    lista.map((c) => (c.id === atualizado.id ? atualizado : c)),
                );
            } else {
                const criado = await criarCategoria({ nome });
                setCategorias((lista) => [...lista, criado]);
            }
            setModalAberto(false);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar categoria."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!excluindo) return;
        setExcluindoId(excluindo.id);
        try {
            await deletarCategoria(excluindo.id);
            setCategorias((lista) => lista.filter((c) => c.id !== excluindo.id));
            setExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir categoria."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Categorias</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Catálogo de categorias de produtos.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Nova categoria
                </button>
            </div>

            {erro ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Nome</th>
                            <th className="px-4 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {carregando ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                    Carregando…
                                </td>
                            </tr>
                        ) : null}
                        {!carregando && categorias.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                    Nenhuma categoria cadastrada.
                                </td>
                            </tr>
                        ) : null}
                        {categorias.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{item.nome}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => abrirEdicao(item)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setExcluindo(item)}
                                        disabled={excluindoId === item.id}
                                        className="border border-red-300 px-3 py-1.5 font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalAberto ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl"
                    >
                        <h2 className="text-lg font-semibold">{tituloModal}</h2>
                        <label className="block text-sm font-medium text-slate-700">
                            Nome
                            <input
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                required
                            />
                        </label>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="border border-slate-300 px-4 py-2 text-sm font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={salvando}
                                className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            {excluindo ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
                        <p className="text-sm text-slate-700">
                            Excluir a categoria &quot;{excluindo.nome}&quot;? Produtos
                            vinculados ficam sem categoria.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setExcluindo(null)}
                                className="border border-slate-300 px-4 py-2 text-sm font-semibold"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => void confirmarExclusao()}
                                className="bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
