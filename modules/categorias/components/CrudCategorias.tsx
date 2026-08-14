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
import { TabelaCategorias } from "./TabelaCategorias";

export function CrudCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
    const [categoriaExcluindo, setCategoriaExcluindo] = useState<Categoria | null>(null);
    const [nome, setNome] = useState("");

    const tituloModal = useMemo(
        () => (categoriaEditando ? "Editar categoria" : "Nova categoria"),
        [categoriaEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarCategorias()
            .then((lista) => {
                if (!cancelado) {
                    setCategorias(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar categorias."));
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
        setCategoriaEditando(null);
        setNome("");
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(categoria: Categoria) {
        setCategoriaEditando(categoria);
        setNome(categoria.nome);
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }
        setModalAberto(false);
        setCategoriaEditando(null);
        setNome("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const dados = { nome: nome.trim() };

            if (categoriaEditando) {
                const atualizado = await atualizarCategoria(categoriaEditando.id, dados);
                setCategorias((lista) =>
                    lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
                );
            } else {
                const criado = await criarCategoria(dados);
                setCategorias((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar categoria."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!categoriaExcluindo) {
            return;
        }

        setExcluindoId(categoriaExcluindo.id);
        setErro("");

        try {
            await deletarCategoria(categoriaExcluindo.id);
            setCategorias((lista) =>
                lista.filter((item) => item.id !== categoriaExcluindo.id),
            );
            setCategoriaExcluindo(null);
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
                        Categorias da sua loja, usadas ao cadastrar produtos.
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
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <TabelaCategorias
                categorias={categorias}
                onEditar={abrirEdicao}
                onExcluir={setCategoriaExcluindo}
                carregando={carregando}
                excluindoId={excluindoId}
            />

            {modalAberto ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {tituloModal}
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {categoriaEditando
                                        ? "Altere o nome da categoria."
                                        : "Informe o nome da nova categoria."}
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
                                    value={nome}
                                    onChange={(event) => setNome(event.target.value)}
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>
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
            ) : null}

            {categoriaExcluindo ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir categoria
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {categoriaExcluindo.nome}? Produtos
                            ligados a ela ficam sem categoria.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCategoriaExcluindo(null)}
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
                                {excluindoId !== null ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
