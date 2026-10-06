"use client";

import { useState } from "react";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    confirmarEntregaSorteio,
    refazerSorteio,
    sortearSorteio,
} from "../services/servicoSorteio";
import { SituacaoResultadoSorteio, Sorteio } from "../types/sorteio.types";

interface PainelResultadoSorteioProps {
    sorteio: Sorteio;
    nomeCampanha: string;
    onFechar: () => void;
    onAtualizado: (sorteio: Sorteio) => void;
}

type Acao = "sortear" | "refazer" | "confirmar";

const ROTULO_SITUACAO: Record<SituacaoResultadoSorteio, string> = {
    AGUARDANDO_ENTREGA: "Aguardando entrega",
    ENTREGUE: "Entregue",
    CANCELADO: "Cancelado (refeito)",
};

function formatarDataHora(data: Date) {
    return data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/** G17: associação sorteia 1..N tickets, confirma a entrega ou refaz o sorteio. */
export function PainelResultadoSorteio({
    sorteio,
    nomeCampanha,
    onFechar,
    onAtualizado,
}: PainelResultadoSorteioProps) {
    const [acao, setAcao] = useState<Acao | null>(null);
    const [erro, setErro] = useState("");

    const atual = sorteio.resultadoAtual;
    const cancelados = sorteio.historico.filter((item) => item.situacao === "CANCELADO");
    const podeSortear = sorteio.campanhaEncerrada && sorteio.totalTickets > 0 && !atual;
    const processando = acao !== null;

    async function executar(tipo: Acao) {
        if (
            tipo === "refazer" &&
            !window.confirm(
                "Refazer o sorteio? O resultado atual será cancelado e um novo número será sorteado.",
            )
        ) {
            return;
        }

        setErro("");
        setAcao(tipo);
        try {
            const operacoes = {
                sortear: sortearSorteio,
                refazer: refazerSorteio,
                confirmar: confirmarEntregaSorteio,
            };
            onAtualizado(await operacoes[tipo](sorteio.id));
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao processar o sorteio."));
        } finally {
            setAcao(null);
        }
    }

    return (
        <ModalOverlay onFechar={onFechar} bloqueado={processando} largura="lg">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="painel-eyebrow">Sorteio</p>
                    <h2 className="text-xl font-semibold text-navy">{nomeCampanha}</h2>
                    <p className="mt-1 text-sm text-muted">
                        {sorteio.totalTickets} ticket(s) participando · número sorteado entre 1 e{" "}
                        {sorteio.totalTickets || "—"}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onFechar}
                    disabled={processando}
                    className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy disabled:opacity-50"
                    aria-label="Fechar modal"
                >
                    ×
                </button>
            </div>

            {erro ? (
                <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {erro}
                </div>
            ) : null}

            {atual ? (
                <div className="painel-card space-y-3 px-5 py-4" aria-live="polite">
                    <div className="flex items-baseline justify-between gap-4">
                        <p className="text-sm text-muted">Número sorteado</p>
                        <span className="text-sm font-medium text-navy">
                            {ROTULO_SITUACAO[atual.situacao]}
                        </span>
                    </div>
                    <p className="text-5xl font-bold text-primary">#{atual.numeroSorteado}</p>
                    <div className="text-sm text-navy">
                        <p className="font-semibold">{atual.vencedor.nome}</p>
                        <p className="text-muted">{atual.vencedor.email}</p>
                        <p className="text-muted">CPF {atual.vencedor.cpfMascarado}</p>
                    </div>
                    <p className="text-xs text-muted">
                        Sorteado em {formatarDataHora(atual.dataSorteio)}
                    </p>

                    {atual.situacao === "AGUARDANDO_ENTREGA" ? (
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => void executar("refazer")}
                                disabled={processando}
                                className="btn-perigo text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {acao === "refazer" ? "Sorteando..." : "Vencedor não apareceu — refazer"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void executar("confirmar")}
                                disabled={processando}
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {acao === "confirmar" ? "Confirmando..." : "Confirmar entrega do prêmio"}
                            </button>
                        </div>
                    ) : null}
                </div>
            ) : (
                <div className="painel-card space-y-3 px-5 py-6 text-center">
                    {!sorteio.campanhaEncerrada ? (
                        <p className="text-sm text-muted">
                            O sorteio só fica disponível depois do término da campanha.
                        </p>
                    ) : sorteio.totalTickets === 0 ? (
                        <p className="text-sm text-muted">
                            Esta campanha não tem tickets para sortear.
                        </p>
                    ) : (
                        <p className="text-sm text-muted">
                            Gere um número aleatório entre 1 e {sorteio.totalTickets}. O dono do
                            ticket sorteado é o vencedor.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => void executar("sortear")}
                        disabled={!podeSortear || processando}
                        className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {acao === "sortear" ? "Sorteando..." : "Gerar número aleatório"}
                    </button>
                </div>
            )}

            {cancelados.length > 0 ? (
                <div className="mt-5">
                    <h3 className="mb-2 text-sm font-semibold text-navy">Sorteios refeitos</h3>
                    <ul className="painel-card divide-y divide-border overflow-hidden text-sm">
                        {cancelados.map((item) => (
                            <li key={item.id} className="px-4 py-2.5 text-muted">
                                <span className="font-medium text-navy">#{item.numeroSorteado}</span>
                                {" · "}
                                {item.vencedor.nome}
                                {" · "}
                                {formatarDataHora(item.dataSorteio)}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </ModalOverlay>
    );
}
