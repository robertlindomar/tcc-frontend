import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    confirmarEntregaResgate,
    listarResgatesLoja,
    recusarResgate,
} from "../services/servicoRecompensa";
import { ResgateRecompensa } from "../types/recompensa.types";

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function PainelResgatesLoja() {
    const [resgates, setResgates] = useState<ResgateRecompensa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [acaoId, setAcaoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;
        listarResgatesLoja()
            .then((lista) => {
                if (!cancelado) setResgates(lista);
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar resgates."));
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });
        return () => {
            cancelado = true;
        };
    }, []);

    async function handleConfirmar(item: ResgateRecompensa) {
        setErro("");
        setAcaoId(item.id);
        try {
            const atualizado = await confirmarEntregaResgate(item.id);
            setResgates((atual) =>
                atual.map((resgate) => (resgate.id === atualizado.id ? atualizado : resgate)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao confirmar entrega."));
        } finally {
            setAcaoId(null);
        }
    }

    async function handleRecusar(item: ResgateRecompensa) {
        const confirmado = window.confirm(
            `Recusar o resgate de "${item.nomeRecompensaSnapshot}"? Os ${item.custoPontosSnapshot} pontos serão devolvidos ao consumidor.`,
        );
        if (!confirmado) return;

        setErro("");
        setAcaoId(item.id);
        try {
            const atualizado = await recusarResgate(item.id);
            setResgates((atual) =>
                atual.map((resgate) => (resgate.id === atualizado.id ? atualizado : resgate)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao recusar resgate."));
        } finally {
            setAcaoId(null);
        }
    }

    const pendentes = resgates.filter((item) => item.status === "PENDENTE_ENTREGA");
    const entregues = resgates.filter((item) => item.status === "ENTREGUE");
    const recusados = resgates.filter((item) => item.status === "RECUSADO");

    return (
        <section className="space-y-5">
            {erro ? (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            ) : null}

            {carregando ? (
                <p className="text-sm text-muted">Carregando resgates...</p>
            ) : (
                <>
                    <div>
                        <h2 className="mb-2 text-lg font-semibold text-navy">Pendentes de entrega</h2>
                        {pendentes.length === 0 ? (
                            <div className="painel-card px-4 py-8 text-center text-sm text-muted">Nenhum resgate aguardando entrega.</div>
                        ) : (
                            <ul className="painel-card divide-y divide-border overflow-hidden">
                                {pendentes.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="text-sm">
                                            <p className="font-medium text-navy">
                                                {item.nomeConsumidor ?? "Consumidor"}
                                            </p>
                                            <p className="text-muted">
                                                {item.nomeRecompensaSnapshot} · {item.custoPontosSnapshot}{" "}
                                                pontos
                                            </p>
                                            <p className="text-xs text-muted">
                                                Resgatado em {formatarData(item.dataCriacao)}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                disabled={acaoId === item.id}
                                                onClick={() => void handleConfirmar(item)}
                                                className="btn-primario text-sm disabled:opacity-60"
                                            >
                                                {acaoId === item.id
                                                    ? "Processando..."
                                                    : "Confirmar entrega"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={acaoId === item.id}
                                                onClick={() => void handleRecusar(item)}
                                                className="btn-perigo text-sm disabled:opacity-60"
                                            >
                                                Recusar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {entregues.length > 0 ? (
                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-navy">Entregues</h2>
                            <ul className="painel-card divide-y divide-border overflow-hidden text-sm">
                                {entregues.map((item) => (
                                    <li key={item.id} className="px-4 py-3 text-muted">
                                        <span className="font-medium text-navy">
                                            {item.nomeConsumidor ?? "Consumidor"}
                                        </span>
                                        {" · "}
                                        {item.nomeRecompensaSnapshot}
                                        {" · ENTREGUE"}
                                        {item.dataEntrega
                                            ? ` em ${formatarData(item.dataEntrega)}`
                                            : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {recusados.length > 0 ? (
                        <div>
                            <h2 className="mb-2 text-lg font-semibold text-navy">Recusados</h2>
                            <ul className="painel-card divide-y divide-border overflow-hidden text-sm">
                                {recusados.map((item) => (
                                    <li key={item.id} className="px-4 py-3 text-muted">
                                        <span className="font-medium text-navy">
                                            {item.nomeConsumidor ?? "Consumidor"}
                                        </span>
                                        {" · "}
                                        {item.nomeRecompensaSnapshot}
                                        {" · RECUSADO · "}
                                        {item.custoPontosSnapshot} pontos devolvidos
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </>
            )}
        </section>
    );
}
