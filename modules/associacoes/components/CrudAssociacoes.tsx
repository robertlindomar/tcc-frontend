"use client";

import { FormEvent, useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { atualizarAssociacao, listarAssociacoes } from "../services/servicoAssociacao";
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

/**
 * `GET /associacao` já devolve somente a associação do usuário logado. Criar
 * outra não faz sentido (é 1:1 com a conta) e excluir sairia do ar sozinho, por
 * isso a tela só lista e edita.
 */
export function CrudAssociacoes() {
    const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [associacaoEditando, setAssociacaoEditando] = useState<Associacao | null>(
        null,
    );
    const [form, setForm] = useState<FormState>(formInicial);

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
                        obterMensagemErroApi(error, "Erro ao carregar a associação."),
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
        setAviso("");
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setAssociacaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        if (!associacaoEditando) {
            return;
        }

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);

        try {
            const atualizado = await atualizarAssociacao(associacaoEditando.id, {
                nomeFantasia: form.nomeFantasia,
                razaoSocial: form.razaoSocial,
                cnpj: form.cnpj,
                inscricaoEstadual,
            });

            setAssociacoes((lista) =>
                lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
            );
            setAssociacaoEditando(null);
            setForm(formInicial);
            setAviso("Dados da associação atualizados.");
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar a associação."));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <section className="space-y-5">
            <header className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Minha associação</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Dados cadastrais da associação que você administra.
                </p>
            </header>

            {erro ? (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            {aviso ? (
                <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {aviso}
                </div>
            ) : null}

            <div className="overflow-x-auto">
                <TabelaAssociacoes
                    associacoes={associacoes}
                    onEditar={abrirEdicao}
                    carregando={carregando}
                />
            </div>

            {associacaoEditando ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Editar associação
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    Altere os dados da associação.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharModal}
                                className="px-2 py-1 text-2xl leading-none text-slate-500 hover:text-slate-900"
                                aria-label="Fechar"
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
            ) : null}
        </section>
    );
}
