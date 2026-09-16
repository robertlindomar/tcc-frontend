"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import {
    atualizarRecompensa,
    criarRecompensa,
    deletarRecompensa,
    desativarRecompensa,
    listarRecompensas,
    reativarRecompensa,
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

    async function handleReativar(item: Recompensa) {
        setErro("");
        try {
            const atualizado = await reativarRecompensa(item.id);
            setLista((atual) =>
                atual.map((r) => (r.id === atualizado.id ? atualizado : r)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao reativar."));
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
        <section className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">LOJISTA</p>
                    <h1 className="painel-titulo">Recompensas</h1>
                    <p className="painel-subtitulo">
                        Prêmios que o consumidor resgata com pontos.
                    </p>
                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAba("recompensas")}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                                aba === "recompensas"
                                    ? "bg-sidebar text-sidebar-foreground"
                                    : "btn-secundario"
                            }`}
                        >
                            Recompensas
                        </button>
                        <button
                            type="button"
                            onClick={() => setAba("resgates")}
                            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                                aba === "resgates"
                                    ? "bg-sidebar text-sidebar-foreground"
                                    : "btn-secundario"
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
                        className="btn-primario"
                    >
                        Nova recompensa
                    </button>
                ) : null}
            </div>

            {erro && (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            )}

            {aba === "resgates" ? (
                <PainelResgatesLoja />
            ) : (
            <div className="painel-card overflow-hidden">
                <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-[#f7faf8] text-muted">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Nome</th>
                            <th className="px-4 py-3 text-left font-semibold">Pontos</th>
                            <th className="px-4 py-3 text-left font-semibold">Estoque</th>
                            <th className="px-4 py-3 text-left font-semibold">Situação</th>
                            <th className="px-4 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {carregando && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                                    Carregando...
                                </td>
                            </tr>
                        )}
                        {!carregando && lista.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                                    Nenhuma recompensa cadastrada.
                                </td>
                            </tr>
                        )}
                        {!carregando &&
                            lista.map((item) => (
                                <tr key={item.id} className="hover:bg-[#f7faf8]">
                                    <td className="px-4 py-3 font-medium">
                                        {item.nome}
                                        {item.descricao ? (
                                            <p className="text-xs font-normal text-muted">
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
                                            className="btn-secundario text-sm"
                                        >
                                            Editar
                                        </button>
                                        {item.ativa ? (
                                            <button
                                                type="button"
                                                onClick={() => handleDesativar(item)}
                                                className="ml-2 btn-secundario text-sm"
                                            >
                                                Desativar
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleReativar(item)}
                                                className="btn-secundario ml-2 text-sm text-emerald-800"
                                            >
                                                Reativar
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => handleExcluir(item)}
                                            className="btn-perigo ml-2 text-sm"
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
                <ModalOverlay onFechar={() => { if (!salvando) setModalAberto(false); }} bloqueado={salvando}>
                    <h2 className="text-xl font-semibold text-navy">{tituloModal}</h2>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <label className="block text-sm font-medium text-navy">
                            Nome
                            <input
                                required
                                value={form.nome}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, nome: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                        </label>
                        <label className="block text-sm font-medium text-navy">
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
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                        </label>
                        <label className="block text-sm font-medium text-navy">
                            Estoque
                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={form.estoque}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, estoque: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                            <span className="mt-1 block text-xs font-normal text-muted">
                                Deixe vazio para quantidade ilimitada.
                            </span>
                        </label>
                        <label className="block text-sm font-medium text-navy">
                            Válida até
                            <input
                                type="date"
                                value={form.dataFim}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, dataFim: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                            <span className="mt-1 block text-xs font-normal text-muted">
                                Deixe vazio para não definir uma data de vencimento.
                            </span>
                        </label>
                        <label className="block text-sm font-medium text-navy">
                            Descrição (opcional)
                            <textarea
                                rows={3}
                                value={form.descricao}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, descricao: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                        </label>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setModalAberto(false)}
                                className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={salvando}
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            )}
        </section>
    );
}
