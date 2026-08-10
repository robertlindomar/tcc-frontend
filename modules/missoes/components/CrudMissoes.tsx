"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarMissao,
    criarMissao,
    deletarMissao,
    listarMissoes,
} from "../services/servicoMissao";
import { Missao } from "../types/missao.types";
import { TabelaMissoes } from "./TabelaMissoes";

type FormState = {
    nome: string;
    descricao: string;
    pontoRecompensa: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    pontoRecompensa: "",
};

function parsePontoRecompensa(valor: string): number | undefined {
    const trim = valor.trim();
    if (!trim) {
        return 0;
    }
    const numero = Number(trim);
    return Number.isInteger(numero) && numero >= 0 ? numero : undefined;
}

export function CrudMissoes() {
    const [missoes, setMissoes] = useState<Missao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [missaoEditando, setMissaoEditando] = useState<Missao | null>(null);
    const [missaoExcluindo, setMissaoExcluindo] = useState<Missao | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (missaoEditando ? "Editar missão" : "Nova missão"),
        [missaoEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarMissoes()
            .then((lista) => {
                if (!cancelado) {
                    setMissoes(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar missões."));
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
        setMissaoEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(missao: Missao) {
        setMissaoEditando(missao);
        setForm({
            nome: missao.nome,
            descricao: missao.descricao ?? "",
            pontoRecompensa: String(missao.pontoRecompensa),
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setMissaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const pontoRecompensa = parsePontoRecompensa(form.pontoRecompensa);
        if (pontoRecompensa === undefined) {
            setErro("Pontos de recompensa inválidos.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome.trim(),
                descricao: form.descricao.trim() || null,
                pontoRecompensa,
            };

            if (missaoEditando) {
                const atualizado = await atualizarMissao(missaoEditando.id, dados);
                setMissoes((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarMissao(dados);
                setMissoes((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar missão."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!missaoExcluindo) {
            return;
        }

        setExcluindoId(missaoExcluindo.id);
        setErro("");

        try {
            await deletarMissao(missaoExcluindo.id);
            setMissoes((lista) =>
                lista.filter((item) => item.id !== missaoExcluindo.id),
            );
            setMissaoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir missão."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Missões</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de missões.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Nova missão
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaMissoes
                    missoes={missoes}
                    onEditar={abrirEdicao}
                    onExcluir={setMissaoExcluindo}
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
                                    {missaoEditando
                                        ? "Altere os dados da missão."
                                        : "Informe os dados para cadastrar uma missão."}
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
                                Pontos de recompensa (opcional)
                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={form.pontoRecompensa}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            pontoRecompensa: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    placeholder="0"
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

            {missaoExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir missão
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {missaoExcluindo.nome}? Essa ação
                            não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setMissaoExcluindo(null)}
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
