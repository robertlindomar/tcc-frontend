"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { NavModulos } from "@/shared/components/NavModulos";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarAssociacao,
    criarAssociacao,
    deletarAssociacao,
    listarAssociacoes,
} from "../services/servicoAssociacao";
import { Associacao } from "../types/associacao.types";
import { TabelaAssociacoes } from "./TabelaAssociacoes";

type FormState = {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: string;
};

const formInicial: FormState = {
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
};

function parseInscricaoEstadual(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isNaN(numero) ? undefined : numero;
}

export function CrudAssociacoes() {
    const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [associacaoEditando, setAssociacaoEditando] = useState<Associacao | null>(
        null,
    );
    const [associacaoExcluindo, setAssociacaoExcluindo] =
        useState<Associacao | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (associacaoEditando ? "Editar associação" : "Nova associação"),
        [associacaoEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarAssociacoes()
            .then((lista) => {
                if (!cancelado) {
                    setAssociacoes(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(error, "Erro ao carregar associações."),
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
        setAssociacaoEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(associacao: Associacao) {
        setAssociacaoEditando(associacao);
        setForm({
            nomeFantasia: associacao.nomeFantasia,
            razaoSocial: associacao.razaoSocial,
            cnpj: associacao.cnpj,
            inscricaoEstadual:
                associacao.inscricaoEstadual != null
                    ? String(associacao.inscricaoEstadual)
                    : "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setAssociacaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);

        try {
            if (associacaoEditando) {
                const atualizado = await atualizarAssociacao(associacaoEditando.id, {
                    nomeFantasia: form.nomeFantasia,
                    razaoSocial: form.razaoSocial,
                    cnpj: form.cnpj,
                    inscricaoEstadual,
                });

                setAssociacoes((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarAssociacao({
                    nomeFantasia: form.nomeFantasia,
                    razaoSocial: form.razaoSocial,
                    cnpj: form.cnpj,
                    inscricaoEstadual,
                });
                setAssociacoes((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar associação."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!associacaoExcluindo) {
            return;
        }

        setExcluindoId(associacaoExcluindo.id);
        setErro("");

        try {
            await deletarAssociacao(associacaoExcluindo.id);
            setAssociacoes((lista) =>
                lista.filter((item) => item.id !== associacaoExcluindo.id),
            );
            setAssociacaoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir associação."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Associações</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de associações.
                    </p>
                    <NavModulos atual="/associacoes" />
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Nova associação
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaAssociacoes
                    associacoes={associacoes}
                    onEditar={abrirEdicao}
                    onExcluir={setAssociacaoExcluindo}
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
                                    {associacaoEditando
                                        ? "Altere os dados da associação."
                                        : "Informe os dados para cadastrar uma associação."}
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
                                Nome fantasia
                                <input
                                    type="text"
                                    value={form.nomeFantasia}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            nomeFantasia: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Razão social
                                <input
                                    type="text"
                                    value={form.razaoSocial}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            razaoSocial: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                CNPJ
                                <input
                                    type="text"
                                    value={form.cnpj}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            cnpj: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Inscrição estadual (opcional)
                                <input
                                    type="number"
                                    value={form.inscricaoEstadual}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            inscricaoEstadual: event.target.value,
                                        }))
                                    }
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

            {associacaoExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir associação
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {associacaoExcluindo.nomeFantasia}?
                            Essa ação não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setAssociacaoExcluindo(null)}
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
