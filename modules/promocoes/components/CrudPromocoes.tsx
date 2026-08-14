"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarProdutos } from "@/modules/produtos/services/servicoProduto";
import { Produto } from "@/modules/produtos/types/produto.types";
import {
    atualizarPromocao,
    criarPromocao,
    deletarPromocao,
    desativarPromocao,
    listarPromocoes,
} from "../services/servicoPromocao";
import { Promocao } from "../types/promocao.types";
import { TabelaPromocoes } from "./TabelaPromocoes";

type FormState = {
    descricao: string;
    preco: string;
    produtoId: string;
    duracaoDias: string;
};

const formInicial: FormState = {
    descricao: "",
    preco: "",
    produtoId: "",
    duracaoDias: "7",
};

function parsePreco(valor: string): number | undefined {
    const trim = valor.trim().replace(",", ".");
    if (!trim) {
        return undefined;
    }
    const numero = Number(trim);
    return Number.isFinite(numero) ? numero : undefined;
}

export function CrudPromocoes() {
    const [promocoes, setPromocoes] = useState<Promocao[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [desativandoId, setDesativandoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [promocaoEditando, setPromocaoEditando] = useState<Promocao | null>(null);
    const [promocaoExcluindo, setPromocaoExcluindo] = useState<Promocao | null>(null);
    const [promocaoDesativando, setPromocaoDesativando] = useState<Promocao | null>(
        null,
    );
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (promocaoEditando ? "Editar promoção" : "Nova promoção"),
        [promocaoEditando],
    );

    const nomeProdutoPorId = useMemo(() => {
        const mapa: Record<number, string> = {};
        for (const produto of produtos) {
            mapa[produto.id] = produto.nome;
        }
        return mapa;
    }, [produtos]);

    useEffect(() => {
        let cancelado = false;

        Promise.all([listarPromocoes(), listarProdutos()])
            .then(([listaPromocoes, listaProdutos]) => {
                if (!cancelado) {
                    setPromocoes(listaPromocoes);
                    setProdutos(listaProdutos);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(error, "Erro ao carregar promoções."),
                    );
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
        setPromocaoEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(promocao: Promocao) {
        setPromocaoEditando(promocao);
        setForm({
            descricao: promocao.descricao ?? "",
            preco: String(promocao.preco),
            produtoId: String(promocao.produtoId),
            duracaoDias: "7",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setPromocaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const preco = parsePreco(form.preco);
        if (preco === undefined) {
            setErro("Preço inválido.");
            return;
        }

        const produtoId = Number(form.produtoId);
        if (!Number.isInteger(produtoId) || produtoId <= 0) {
            setErro("Selecione um produto.");
            return;
        }

        const duracaoDias = Number(form.duracaoDias);
        if (!Number.isInteger(duracaoDias) || duracaoDias < 1) {
            setErro("Informe a duração em dias (mínimo 1).");
            return;
        }

        setSalvando(true);

        try {
            if (promocaoEditando) {
                const atualizado = await atualizarPromocao(promocaoEditando.id, {
                    descricao: form.descricao.trim() || null,
                    preco,
                    produtoId,
                    duracaoDias,
                });
                setPromocoes((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarPromocao({
                    descricao: form.descricao.trim() || null,
                    preco,
                    produtoId,
                    duracaoDias,
                });
                setPromocoes((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar promoção."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!promocaoExcluindo) {
            return;
        }

        setExcluindoId(promocaoExcluindo.id);
        setErro("");

        try {
            await deletarPromocao(promocaoExcluindo.id);
            setPromocoes((lista) =>
                lista.filter((item) => item.id !== promocaoExcluindo.id),
            );
            setPromocaoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir promoção."));
        } finally {
            setExcluindoId(null);
        }
    }

    async function confirmarDesativacao() {
        if (!promocaoDesativando) {
            return;
        }

        setDesativandoId(promocaoDesativando.id);
        setErro("");

        try {
            const atualizado = await desativarPromocao(promocaoDesativando.id);
            setPromocoes((lista) =>
                lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
            );
            setPromocaoDesativando(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao desativar promoção."));
        } finally {
            setDesativandoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Promoções</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Cadastre promoções com duração em dias. Desativar mantém o
                        histórico; excluir remove o registro.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Nova promoção
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaPromocoes
                    promocoes={promocoes}
                    nomeProdutoPorId={nomeProdutoPorId}
                    onEditar={abrirEdicao}
                    onDesativar={setPromocaoDesativando}
                    onExcluir={setPromocaoExcluindo}
                    carregando={carregando}
                    excluindoId={excluindoId}
                    desativandoId={desativandoId}
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
                                    {promocaoEditando
                                        ? "Altere os dados da promoção."
                                        : "Informe os dados para cadastrar uma promoção."}
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
                                Produto
                                <select
                                    value={form.produtoId}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            produtoId: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtos.map((produto) => (
                                        <option key={produto.id} value={produto.id}>
                                            {produto.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Preço
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.preco}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            preco: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Duração da promoção (dias) *
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    value={form.duracaoDias}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            duracaoDias: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Descrição (opcional)
                                <textarea
                                    value={form.descricao}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            descricao: event.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
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
            )}

            {promocaoDesativando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Desativar promoção
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            A promoção deixa de valer, mas o registro permanece. Não há
                            reativação nesta versão.
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPromocaoDesativando(null)}
                                disabled={desativandoId !== null}
                                className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarDesativacao}
                                disabled={desativandoId !== null}
                                className="bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {desativandoId ? "Desativando..." : "Desativar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {promocaoExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir promoção
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão da promoção do produto{" "}
                            {nomeProdutoPorId[promocaoExcluindo.produtoId] ??
                                `#${promocaoExcluindo.produtoId}`}
                            ? Essa ação não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPromocaoExcluindo(null)}
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
