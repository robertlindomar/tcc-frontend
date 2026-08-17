import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    confirmarEntregaResgate,
    listarResgatesLoja,
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
    const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
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
        setConfirmandoId(item.id);
        try {
            const atualizado = await confirmarEntregaResgate(item.id);
            setResgates((atual) =>
                atual.map((resgate) => (resgate.id === atualizado.id ? atualizado : resgate)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao confirmar entrega."));
        } finally {
            setConfirmandoId(null);
        }
    }

    const pendentes = resgates.filter((item) => item.status === "PENDENTE_ENTREGA");
    const entregues = resgates.filter((item) => item.status === "ENTREGUE");

    return (
        <section className="space-y-4">
            {erro ? (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            {carregando ? (
                <p className="text-sm text-slate-500">Carregando resgates...</p>
            ) : (
                <>
                    <div>
                        <h2 className="mb-2 text-lg font-semibold">Pendentes de entrega</h2>
                        {pendentes.length === 0 ? (
                            <p className="text-sm text-slate-500">Nenhum resgate aguardando entrega.</p>
                        ) : (
                            <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
                                {pendentes.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="text-sm">
                                            <p className="font-medium text-slate-900">
                                                {item.nomeConsumidor ?? "Consumidor"}
                                            </p>
                                            <p className="text-slate-600">
                                                {item.nomeRecompensaSnapshot} · {item.custoPontosSnapshot}{" "}
                                                pontos
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Resgatado em {formatarData(item.dataCriacao)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={confirmandoId === item.id}
                                            onClick={() => handleConfirmar(item)}
                                            className="bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {confirmandoId === item.id
                                                ? "Confirmando..."
                                                : "Confirmar entrega"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {entregues.length > 0 ? (
                        <div>
                            <h2 className="mb-2 text-lg font-semibold">Entregues</h2>
                            <ul className="divide-y divide-slate-200 border border-slate-200 bg-white text-sm">
                                {entregues.map((item) => (
                                    <li key={item.id} className="px-4 py-3 text-slate-600">
                                        <span className="font-medium text-slate-900">
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
                </>
            )}
        </section>
    );
}
