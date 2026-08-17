"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarRecompensa,
    criarRecompensa,
    deletarRecompensa,
    desativarRecompensa,
    listarRecompensas,
} from "../services/servicoRecompensa";
import { Recompensa, SituacaoRecompensa } from "../types/recompensa.types";
import { PainelResgatesLoja } from "./PainelResgatesLoja";

type FormState = {
    nome: string;
    descricao: string;
    custoPontos: string;
    estoque: string;
    dataFim: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    custoPontos: "",
    estoque: "",
    dataFim: "",
};

function rotuloSituacao(situacao: SituacaoRecompensa) {
    if (situacao === "DESATIVADA") return "Desativada";
    if (situacao === "EXPIRADA") return "Expirada";
    if (situacao === "ESGOTADA") return "Esgotada";
    return "Disponível";
}

function rotuloEstoque(estoque: number | null) {
    return estoque === null ? "Ilimitado" : String(estoque);
}

export function CrudRecompensas() {
    const [aba, setAba] = useState<"recompensas" | "resgates">("recompensas");
    const [lista, setLista] = useState<Recompensa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [editando, setEditando] = useState<Recompensa | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (editando ? "Editar recompensa" : "Nova recompensa"),
        [editando],
    );

    useEffect(() => {
        let cancelado = false;
        listarRecompensas()
            .then((itens) => {
                if (!cancelado) setLista(itens);
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar recompensas."));
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
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(item: Recompensa) {
        setEditando(item);
        setForm({
            nome: item.nome,
            descricao: item.descricao ?? "",
            custoPontos: String(item.custoPontos),
            estoque: item.estoque === null ? "" : String(item.estoque),
            dataFim: item.dataFimCivil ?? "",
        });
        setErro("");
        setModalAberto(true);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const custo = Number(form.custoPontos);
        if (!Number.isInteger(custo) || custo < 1) {
            setErro("Informe um custo em pontos inteiro maior que zero.");
            return;
        }
        let estoque: number | null = null;
        if (form.estoque.trim() !== "") {
            estoque = Number(form.estoque);
            if (!Number.isInteger(estoque) || estoque < 0) {
                setErro("Estoque deve ser um inteiro maior ou igual a zero, ou vazio para ilimitado.");
                return;
            }
        }
        setSalvando(true);
        setErro("");
        try {
            const dados = {
                nome: form.nome.trim(),
                descricao: form.descricao.trim() || null,
                custoPontos: custo,
                estoque,
                dataFim: form.dataFim.trim() || null,
            };
            if (editando) {
                const atualizado = await atualizarRecompensa(editando.id, dados);
                setLista((atual) =>
                    atual.map((item) => (item.id === atualizado.id ? atualizado : item)),
                );
            } else {
                const criado = await criarRecompensa(dados);
                setLista((atual) => [...atual, criado]);
            }
            setModalAberto(false);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar recompensa."));
        } finally {
            setSalvando(false);
        }
    }

    async function handleDesativar(item: Recompensa) {
        setErro("");
        try {
            const atualizado = await desativarRecompensa(item.id);
            setLista((atual) =>
                atual.map((r) => (r.id === atualizado.id ? atualizado : r)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao desativar."));
        }
    }

    async function handleExcluir(item: Recompensa) {
        if (!window.confirm(`Excluir ${item.nome}? Resgates existentes impedem a exclusão.`)) {
            return;
        }
        setErro("");
        try {
            await deletarRecompensa(item.id);
            setLista((atual) => atual.filter((r) => r.id !== item.id));
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir recompensa."));
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Recompensas</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Prêmios que o consumidor resgata com pontos.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAba("recompensas")}
                            className={`px-3 py-1.5 text-sm font-medium ${
                                aba === "recompensas"
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-300 text-slate-700"
                            }`}
                        >
                            Recompensas
                        </button>
                        <button
                            type="button"
                            onClick={() => setAba("resgates")}
                            className={`px-3 py-1.5 text-sm font-medium ${
                                aba === "resgates"
                                    ? "bg-slate-900 text-white"
                                    : "border border-slate-300 text-slate-700"
                            }`}
                        >
                            Resgates
                        </button>
                    </div>
                </div>
                {aba === "recompensas" ? (
                    <button
                        type="button"
                        onClick={abrirCriacao}
                        className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Nova recompensa
                    </button>
                ) : null}
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            {aba === "resgates" ? (
                <PainelResgatesLoja />
            ) : (
            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Nome</th>
                            <th className="px-4 py-3 text-left font-semibold">Pontos</th>
                            <th className="px-4 py-3 text-left font-semibold">Estoque</th>
                            <th className="px-4 py-3 text-left font-semibold">Situação</th>
                            <th className="px-4 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {carregando && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    Carregando...
                                </td>
                            </tr>
                        )}
                        {!carregando && lista.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    Nenhuma recompensa cadastrada.
                                </td>
                            </tr>
                        )}
                        {!carregando &&
                            lista.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">
                                        {item.nome}
                                        {item.descricao ? (
                                            <p className="text-xs font-normal text-slate-500">
                                                {item.descricao}
                                            </p>
                                        ) : null}
                                    </td>
                                    <td className="px-4 py-3">{item.custoPontos}</td>
                                    <td className="px-4 py-3">{rotuloEstoque(item.estoque)}</td>
                                    <td className="px-4 py-3">{rotuloSituacao(item.situacao)}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => abrirEdicao(item)}
                                            className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                        >
                                            Editar
                                        </button>
                                        {item.ativa && (
                                            <button
                                                type="button"
                                                onClick={() => handleDesativar(item)}
                                                className="ml-2 border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                            >
                                                Desativar
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleExcluir(item)}
                                            className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            )}

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold">{tituloModal}</h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Nome
                                <input
                                    required
                                    value={form.nome}
                                    onChange={(e) =>
                                        setForm((a) => ({ ...a, nome: e.target.value }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Custo em pontos *
                                <input
                                    type="number"
                                    min={1}
                                    step={1}
                                    required
                                    value={form.custoPontos}
                                    onChange={(e) =>
                                        setForm((a) => ({ ...a, custoPontos: e.target.value }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2"
                                />
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Estoque
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={form.estoque}
                                    onChange={(e) =>
                                        setForm((a) => ({ ...a, estoque: e.target.value }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2"
                                />
                                <span className="mt-1 block text-xs font-normal text-slate-500">
                                    Deixe vazio para quantidade ilimitada.
                                </span>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Válida até
                                <input
                                    type="date"
                                    value={form.dataFim}
                                    onChange={(e) =>
                                        setForm((a) => ({ ...a, dataFim: e.target.value }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2"
                                />
                                <span className="mt-1 block text-xs font-normal text-slate-500">
                                    Deixe vazio para não definir uma data de vencimento.
                                </span>
                            </label>
                            <label className="block text-sm font-medium text-slate-700">
                                Descrição (opcional)
                                <textarea
                                    rows={3}
                                    value={form.descricao}
                                    onChange={(e) =>
                                        setForm((a) => ({ ...a, descricao: e.target.value }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2"
                                />
                            </label>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setModalAberto(false)}
                                    className="border border-slate-300 px-4 py-2 text-sm"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
