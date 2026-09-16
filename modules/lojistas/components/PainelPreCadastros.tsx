"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Eye, Search, X } from "lucide-react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    aprovarLojista,
    listarLojistas,
    rejeitarLojista,
} from "../services/servicoLojista";
import { Lojista } from "../types/lojista.types";
import { ModalDetalheLojista } from "./ModalDetalheLojista";
import { ModalJustificativaRejeicao } from "./ModalJustificativaRejeicao";

export function PainelPreCadastros() {
    const [lojistas, setLojistas] = useState<Lojista[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [acaoId, setAcaoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [detalhe, setDetalhe] = useState<Lojista | null>(null);
    const [rejeitando, setRejeitando] = useState<Lojista | null>(null);

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

    async function handleRejeitar(lojista: Lojista, justificativaRejeicao: string) {
        setAcaoId(lojista.id);
        setErro("");
        try {
            await rejeitarLojista(lojista.id, justificativaRejeicao);
            setLojistas((lista) => lista.filter((item) => item.id !== lojista.id));
            setDetalhe(null);
            setRejeitando(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao rejeitar pré-cadastro."));
        } finally {
            setAcaoId(null);
        }
    }

    const contagem = filtrados.length;
    const rotuloContagem =
        contagem === 1 ? "1 solicitação" : `${contagem} solicitações`;

    return (
        <div className="painel-pagina space-y-6">
            <div>
                <p className="painel-eyebrow">Associação</p>
                <h1 className="painel-titulo">Pré-Cadastros de Lojas</h1>
                <p className="painel-subtitulo">
                    Lista de lojistas que solicitaram pré-cadastro. Aprove ou recuse
                    cada solicitação.
                </p>
            </div>

            {erro ? (
                <div className="painel-card border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="painel-card overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="relative block flex-1">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        <input
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por nome da loja ou CNPJ…"
                            className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-navy outline-none focus:border-primary"
                        />
                    </label>
                    <p className="shrink-0 text-sm text-muted">{rotuloContagem}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead className="bg-[#f7faf8] text-navy">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold">ID</th>
                                <th className="px-5 py-3 text-left font-semibold">
                                    Nome da Loja
                                </th>
                                <th className="px-5 py-3 text-left font-semibold">CNPJ</th>
                                <th className="px-5 py-3 text-left font-semibold">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-right font-semibold">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {carregando ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-muted"
                                    >
                                        Carregando pré-cadastros…
                                    </td>
                                </tr>
                            ) : null}
                            {!carregando && filtrados.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-5 py-10 text-center text-muted"
                                    >
                                        Nenhum pré-cadastro aguardando análise.
                                    </td>
                                </tr>
                            ) : null}
                            {!carregando &&
                                filtrados.map((lojista) => (
                                    <tr
                                        key={lojista.id}
                                        className="hover:bg-[#f7faf8]/80"
                                    >
                                        <td className="px-5 py-3.5 text-muted">
                                            #{lojista.id}
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-navy">
                                            {lojista.nomeFantasia}
                                        </td>
                                        <td className="px-5 py-3.5 text-navy">
                                            {lojista.cnpj}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                                Aguardando
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    title="Aprovar"
                                                    aria-label={`Aprovar ${lojista.nomeFantasia}`}
                                                    disabled={acaoId === lojista.id}
                                                    onClick={() =>
                                                        void handleAprovar(lojista)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover disabled:opacity-50"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Recusar"
                                                    aria-label={`Recusar ${lojista.nomeFantasia}`}
                                                    disabled={acaoId === lojista.id}
                                                    onClick={() =>
                                                        setRejeitando(lojista)
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Ver detalhes"
                                                    aria-label={`Detalhes de ${lojista.nomeFantasia}`}
                                                    onClick={() => setDetalhe(lojista)}
                                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-white hover:opacity-90"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {detalhe ? (
                <ModalDetalheLojista
                    lojista={detalhe}
                    titulo="Detalhes do pré-cadastro"
                    onFechar={() => setDetalhe(null)}
                    acoes={
                        <>
                            <button
                                type="button"
                                disabled={acaoId === detalhe.id}
                                onClick={() => setRejeitando(detalhe)}
                                className="btn-perigo text-sm disabled:opacity-50"
                            >
                                Recusar
                            </button>
                            <button
                                type="button"
                                disabled={acaoId === detalhe.id}
                                onClick={() => void handleAprovar(detalhe)}
                                className="btn-primario text-sm disabled:opacity-50"
                            >
                                Aprovar
                            </button>
                        </>
                    }
                />
            ) : null}

            {rejeitando ? (
                <ModalJustificativaRejeicao
                    nomeLoja={rejeitando.nomeFantasia}
                    salvando={acaoId === rejeitando.id}
                    onCancelar={() => {
                        if (acaoId === null) {
                            setRejeitando(null);
                        }
                    }}
                    onConfirmar={(motivo) => void handleRejeitar(rejeitando, motivo)}
                />
            ) : null}
        </div>
    );
}
