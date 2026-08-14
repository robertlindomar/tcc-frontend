"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Search, XCircle } from "lucide-react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    aprovarLojista,
    listarLojistas,
    rejeitarLojista,
} from "../services/servicoLojista";
import { Lojista } from "../types/lojista.types";

export function PainelPreCadastros() {
    const [lojistas, setLojistas] = useState<Lojista[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [acaoId, setAcaoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [detalhe, setDetalhe] = useState<Lojista | null>(null);

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const lista = await listarLojistas({ status: "PENDENTE" });
                if (!cancelado) {
                    setLojistas(lista);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(
                            error,
                            "Erro ao carregar pré-cadastros.",
                        ),
                    );
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        void carregar();

        return () => {
            cancelado = true;
        };
    }, []);

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return lojistas;
        return lojistas.filter(
            (item) =>
                item.nomeFantasia.toLowerCase().includes(termo) ||
                item.razaoSocial.toLowerCase().includes(termo) ||
                item.cnpj.toLowerCase().includes(termo),
        );
    }, [busca, lojistas]);

    async function handleAprovar(lojista: Lojista) {
        setAcaoId(lojista.id);
        setErro("");
        try {
            await aprovarLojista(lojista.id);
            setLojistas((lista) => lista.filter((item) => item.id !== lojista.id));
            setDetalhe(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao aprovar pré-cadastro."));
        } finally {
            setAcaoId(null);
        }
    }

    async function handleRejeitar(lojista: Lojista) {
        setAcaoId(lojista.id);
        setErro("");
        try {
            await rejeitarLojista(lojista.id);
            setLojistas((lista) => lista.filter((item) => item.id !== lojista.id));
            setDetalhe(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao rejeitar pré-cadastro."));
        } finally {
            setAcaoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <header>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Pré-Cadastros de Lojas
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Lista de lojistas que solicitaram pré-cadastro. Aprove ou recuse
                    cada solicitação.
                </p>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por nome da loja ou CNPJ…"
                        className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                    />
                </label>
            </div>

            {erro ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-sm">
                <table className="w-full min-w-[720px] text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">ID</th>
                            <th className="px-4 py-3 text-left font-semibold">
                                Nome da Loja
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">CNPJ</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {carregando ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-muted"
                                >
                                    Carregando pré-cadastros…
                                </td>
                            </tr>
                        ) : null}
                        {!carregando && filtrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-muted"
                                >
                                    Nenhum pré-cadastro aguardando análise.
                                </td>
                            </tr>
                        ) : null}
                        {!carregando &&
                            filtrados.map((lojista) => (
                                <tr key={lojista.id} className="hover:bg-slate-50/80">
                                    <td className="px-4 py-3 text-muted">
                                        #{lojista.id}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        {lojista.nomeFantasia}
                                    </td>
                                    <td className="px-4 py-3">{lojista.cnpj}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                            Aguardando
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                type="button"
                                                title="Aprovar"
                                                aria-label={`Aprovar ${lojista.nomeFantasia}`}
                                                disabled={acaoId === lojista.id}
                                                onClick={() => void handleAprovar(lojista)}
                                                className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Recusar"
                                                aria-label={`Recusar ${lojista.nomeFantasia}`}
                                                disabled={acaoId === lojista.id}
                                                onClick={() => void handleRejeitar(lojista)}
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                title="Ver detalhes"
                                                aria-label={`Detalhes de ${lojista.nomeFantasia}`}
                                                onClick={() => setDetalhe(lojista)}
                                                className="rounded-lg p-2 text-primary hover:bg-primary-muted"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {detalhe ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md space-y-4 rounded-[var(--radius)] bg-surface p-6 shadow-xl">
                        <h2 className="text-lg font-semibold">
                            Detalhes do pré-cadastro
                        </h2>
                        <dl className="space-y-2 text-sm">
                            <div>
                                <dt className="text-muted">Nome fantasia</dt>
                                <dd className="font-medium">{detalhe.nomeFantasia}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">Razão social</dt>
                                <dd className="font-medium">{detalhe.razaoSocial}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">CNPJ</dt>
                                <dd className="font-medium">{detalhe.cnpj}</dd>
                            </div>
                            <div>
                                <dt className="text-muted">Status</dt>
                                <dd className="font-medium">Aguardando</dd>
                            </div>
                        </dl>
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setDetalhe(null)}
                                className="border border-border px-4 py-2 text-sm font-semibold"
                            >
                                Fechar
                            </button>
                            <button
                                type="button"
                                disabled={acaoId === detalhe.id}
                                onClick={() => void handleRejeitar(detalhe)}
                                className="border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                            >
                                Recusar
                            </button>
                            <button
                                type="button"
                                disabled={acaoId === detalhe.id}
                                onClick={() => void handleAprovar(detalhe)}
                                className="bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Aprovar
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
