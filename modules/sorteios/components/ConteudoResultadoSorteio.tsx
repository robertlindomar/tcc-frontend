"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroCampanha } from "@/modules/campanhas/utils/erroCampanha";
import {
    confirmarEntregaSorteio,
    refazerSorteio,
    sortearSorteio,
} from "../services/servicoSorteio";
import { SituacaoResultadoSorteio, Sorteio } from "../types/sorteio.types";

interface ConteudoResultadoSorteioProps {
    sorteio: Sorteio;
    onAtualizado: (sorteio: Sorteio) => void;
    /** Informa o container (modal) para bloquear o fechamento durante a ação. */
    onProcessandoChange?: (processando: boolean) => void;
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

function formatarDataNegocio(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

/** G17: sorteio da edição — gera 1..N, confirma a entrega ou refaz. Sem modal próprio. */
export function ConteudoResultadoSorteio({
    sorteio,
    onAtualizado,
    onProcessandoChange,
}: ConteudoResultadoSorteioProps) {
    const [acao, setAcao] = useState<Acao | null>(null);
    const [erro, setErro] = useState("");
    const [agora, setAgora] = useState(() => Date.now());
    useEffect(() => {
        const intervalo = setInterval(() => setAgora(Date.now()), 1_000);
        return () => clearInterval(intervalo);
    }, []);

    const atual = sorteio.resultadoAtual;
    const cancelados = sorteio.historico.filter((item) => item.situacao === "CANCELADO");
    const podeSortear = sorteio.campanhaEncerrada && sorteio.totalTickets > 0 && !atual;
    const processando = acao !== null;
    const prazoEncerrado = atual ? atual.prazoEncerrado || agora > atual.dataLimiteRetirada.getTime() : false;

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
        onProcessandoChange?.(true);
        try {
            const operacoes = {
                sortear: sortearSorteio,
                refazer: refazerSorteio,
                confirmar: confirmarEntregaSorteio,
            };
            onAtualizado(await operacoes[tipo](sorteio.id));
        } catch (error) {
            setErro(obterMensagemErroCampanha(error, "Erro ao processar o sorteio."));
        } finally {
            setAcao(null);
            onProcessandoChange?.(false);
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted">
                {sorteio.totalTickets} ticket(s) na edição {sorteio.edicao} · número sorteado entre 1 e{" "}
                {sorteio.totalTickets || "—"}
            </p>

            {erro ? (
                <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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

                    <p className="text-sm text-muted">
                        Leitura: {atual.dataConfirmacaoLeitura ? `confirmada em ${formatarDataHora(atual.dataConfirmacaoLeitura)}` : "aguardando confirmação no aplicativo"}
                        <br />
                        Retirada até {formatarDataHora(atual.dataLimiteRetirada)}
                        {prazoEncerrado && atual.situacao === "AGUARDANDO_ENTREGA" ? " · prazo encerrado, refazer disponível" : ""}
                    </p>
                    {atual.situacao === "AGUARDANDO_ENTREGA" ? (
                        <div className="flex flex-wrap justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => void executar("refazer")}
                                disabled={processando || !prazoEncerrado}
                                className="btn-perigo text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {acao === "refazer" ? "Sorteando..." : "Vencedor não apareceu — refazer"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void executar("confirmar")}
                                disabled={processando || prazoEncerrado || !atual.dataConfirmacaoLeitura}
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
                            Disponível após {formatarDataNegocio(sorteio.dataFimEdicao)}, quando o
                            período da edição terminar.
                        </p>
                    ) : sorteio.totalTickets === 0 ? (
                        <p className="text-sm text-muted">
                            Esta edição não tem tickets para sortear.
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
                        {acao === "sortear" ? "Sorteando..." : "Sortear"}
                    </button>
                </div>
            )}

            {cancelados.length > 0 ? (
                <div>
                    <h4 className="mb-2 text-sm font-semibold text-navy">Sorteios refeitos</h4>
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
        </div>
    );
}
