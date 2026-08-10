"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { listarCategorias } from "@/modules/categorias/services/servicoCategoria";
import { Categoria } from "@/modules/categorias/types/categoria.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarProduto,
    criarProduto,
    deletarProduto,
    listarProdutos,
} from "../services/servicoProduto";
import { Produto } from "../types/produto.types";
import { TabelaProdutos } from "./TabelaProdutos";

type FormState = {
    nome: string;
    valor: string;
    categoriaId: string;
};

const formInicial: FormState = {
    nome: "",
    valor: "",
    categoriaId: "",
};

function parseValor(valor: string): number | undefined {
    const trim = valor.trim().replace(",", ".");
    if (!trim) {
        return undefined;
    }
    const numero = Number(trim);
    return Number.isFinite(numero) ? numero : undefined;
}

function parseCategoriaId(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}

export function CrudProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
    const [produtoExcluindo, setProdutoExcluindo] = useState<Produto | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (produtoEditando ? "Editar produto" : "Novo produto"),
        [produtoEditando],
    );

    const nomeCategoriaPorId = useMemo(() => {
        const mapa = new Map<number, string>();
        for (const item of categorias) {
            mapa.set(item.id, item.nome);
        }
        return mapa;
    }, [categorias]);

    useEffect(() => {
        let cancelado = false;

        Promise.all([listarProdutos(), listarCategorias()])
            .then(([listaProdutos, listaCategorias]) => {
                if (!cancelado) {
                    setProdutos(listaProdutos);
                    setCategorias(listaCategorias);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar produtos."));
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
        setProdutoEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(produto: Produto) {
        setProdutoEditando(produto);
        setForm({
            nome: produto.nome,
            valor: String(produto.valor),
            categoriaId:
                produto.categoriaId != null ? String(produto.categoriaId) : "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setProdutoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const valor = parseValor(form.valor);
        if (valor === undefined) {
            setErro("Valor inválido.");
            return;
        }

        const categoriaId = parseCategoriaId(form.categoriaId);
        if (categoriaId === undefined) {
            setErro("Categoria inválida.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome.trim(),
                valor,
                categoriaId,
            };

            if (produtoEditando) {
                const atualizado = await atualizarProduto(produtoEditando.id, dados);
                setProdutos((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarProduto(dados);
                setProdutos((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar produto."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!produtoExcluindo) {
            return;
        }

        setExcluindoId(produtoExcluindo.id);
        setErro("");

        try {
            await deletarProduto(produtoExcluindo.id);
            setProdutos((lista) =>
                lista.filter((item) => item.id !== produtoExcluindo.id),
            );
            setProdutoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir produto."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Produtos</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de produtos.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Novo produto
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaProdutos
                    produtos={produtos}
                    nomeCategoriaPorId={nomeCategoriaPorId}
                    onEditar={abrirEdicao}
                    onExcluir={setProdutoExcluindo}
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
                                    {produtoEditando
                                        ? "Altere os dados do produto."
                                        : "Informe os dados para cadastrar um produto."}
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
                                Valor
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.valor}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            valor: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Categoria (opcional)
                                <select
                                    value={form.categoriaId}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            categoriaId: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                >
                                    <option value="">Sem categoria</option>
                                    {categorias.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.nome}
                                        </option>
                                    ))}
                                </select>
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
            )}

            {produtoExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir produto
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {produtoExcluindo.nome}? Essa ação
                            não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setProdutoExcluindo(null)}
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
