"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    listarMeusResgates,
    obterCatalogoRecompensas,
    resgatarRecompensa,
} from "../services/servicoRecompensa";
import { Recompensa, ResgateRecompensa } from "../types/recompensa.types";

export function PainelRecompensasConsumidor() {
    const [pontos, setPontos] = useState<number | null>(null);
    const [nivel, setNivel] = useState<number | null>(null);
    const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
    const [historico, setHistorico] = useState<ResgateRecompensa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [resgatarId, setResgatarId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        let cancelado = false;

        Promise.all([obterCatalogoRecompensas(), listarMeusResgates()])
            .then(([catalogo, resgates]) => {
                if (!cancelado) {
                    setPontos(catalogo.pontos);
                    setNivel(catalogo.nivel);
                    setRecompensas(catalogo.recompensas);
                    setHistorico(resgates);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar recompensas."));
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

    async function handleResgatar(item: Recompensa) {
        setErro("");
        setSucesso("");
        setResgatarId(item.id);
        try {
            const resposta = await resgatarRecompensa(item.id);
            setPontos(resposta.consumidor.pontos);
            setNivel(resposta.consumidor.nivel);
            setHistorico((atual) => [resposta.resgate, ...atual]);
            setSucesso(
                `Resgatado: ${item.nome}. Saldo: ${resposta.consumidor.pontos} pontos.`,
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Não foi possível resgatar."));
        } finally {
            setResgatarId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Recompensas</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Use seus pontos para resgatar prêmios das lojas.
                </p>
            </div>

            {pontos !== null && (
                <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    Seu saldo: <span className="font-semibold">{pontos} pontos</span>
                    {nivel !== null ? ` · nível ${nivel}` : ""}
                </div>
            )}

            {sucesso && (
                <div className="border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {sucesso}
                </div>
            )}
            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            {carregando ? (
                <p className="text-sm text-slate-500">Carregando...</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {recompensas.map((item) => {
                        const saldoOk = pontos !== null && pontos >= item.custoPontos;
                        return (
                            <article
                                key={item.id}
                                className="border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <h2 className="font-semibold text-slate-900">{item.nome}</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {item.custoPontos} pontos
                                </p>
                                {item.descricao && (
                                    <p className="mt-1 text-sm text-slate-500">{item.descricao}</p>
                                )}
                                <button
                                    type="button"
                                    disabled={!item.ativa || !saldoOk || resgatarId === item.id}
                                    onClick={() => handleResgatar(item)}
                                    className="mt-3 bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {!item.ativa
                                        ? "Indisponível"
                                        : !saldoOk
                                          ? "Pontos insuficientes"
                                          : resgatarId === item.id
                                            ? "Resgatando..."
                                            : "Resgatar"}
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}

            <div>
                <h2 className="mb-2 text-lg font-semibold">Meus resgates</h2>
                {historico.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum resgate ainda.</p>
                ) : (
                    <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
                        {historico.map((item) => (
                            <li key={item.id} className="px-4 py-3 text-sm">
                                <span className="font-medium">{item.nomeRecompensaSnapshot}</span>
                                {" · "}
                                {item.custoPontosSnapshot} pontos
                                {" · "}
                                {item.dataCriacao.toLocaleString("pt-BR")}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
