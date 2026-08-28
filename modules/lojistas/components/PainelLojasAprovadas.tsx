"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarLojistas } from "../services/servicoLojista";
import { Lojista } from "../types/lojista.types";
import { ModalDetalheLojista } from "./ModalDetalheLojista";

export function PainelLojasAprovadas() {
    const [lojistas, setLojistas] = useState<Lojista[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [detalhe, setDetalhe] = useState<Lojista | null>(null);

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const lista = await listarLojistas({ status: "APROVADO" });
                if (!cancelado) {
                    setLojistas(lista);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(
                            error,
                            "Erro ao carregar lojas aprovadas.",
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

    return (
        <section className="space-y-5">
            <header>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Lojas Aprovadas
                </h1>
                <p className="mt-1 text-sm text-muted">
                    Comércios com pré-cadastro aprovado pela associação.
                </p>
            </header>

            <label className="relative block max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome da loja ou CNPJ…"
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                />
            </label>

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
                                    Carregando…
                                </td>
                            </tr>
                        ) : null}
                        {!carregando && filtrados.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-4 py-10 text-center text-muted"
                                >
                                    Nenhuma loja aprovada ainda.
                                </td>
                            </tr>
                        ) : null}
                        {!carregando &&
                            filtrados.map((lojista) => (
                                <tr key={lojista.id} className="hover:bg-slate-50/80">
                                    <td className="px-4 py-3 text-muted">
                                        #{lojista.id}
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {lojista.nomeFantasia}
                                    </td>
                                    <td className="px-4 py-3">{lojista.cnpj}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                            Aprovado
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-1">
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
                <ModalDetalheLojista
                    lojista={detalhe}
                    exibirRecompensas
                    onFechar={() => setDetalhe(null)}
                />
            ) : null}
        </section>
    );
}
