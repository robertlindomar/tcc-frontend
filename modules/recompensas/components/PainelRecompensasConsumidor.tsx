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
    const [pendente, setPendente] = useState<Recompensa | null>(null);
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

    async function confirmarResgate(item: Recompensa) {
        setErro("");
        setSucesso("");
        setResgatarId(item.id);
        try {
            const resposta = await resgatarRecompensa(item.id);
            setPontos(resposta.consumidor.pontos);
            setNivel(resposta.consumidor.nivel);
            setHistorico((atual) => [resposta.resgate, ...atual]);
            setRecompensas((atual) =>
                atual.map((recompensa) =>
                    recompensa.id === item.id && recompensa.estoque !== null
                        ? {
                              ...recompensa,
                              estoque: Math.max(0, recompensa.estoque - 1),
                              situacao:
                                  recompensa.estoque - 1 === 0 ? "ESGOTADA" : recompensa.situacao,
                          }
                        : recompensa,
                ),
            );
            setSucesso(
                `Resgate realizado! Apresente este resgate ao estabelecimento. Aguardando confirmação de entrega.`,
            );
            setPendente(null);
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
                        const disponivel = item.situacao === "DISPONIVEL";
                        return (
                            <article
                                key={item.id}
                                className="border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <h2 className="font-semibold text-slate-900">{item.nome}</h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {item.custoPontos} pontos
                                    {item.nomeLoja ? ` · ${item.nomeLoja}` : ""}
                                </p>
                                {item.descricao && (
                                    <p className="mt-1 text-sm text-slate-500">{item.descricao}</p>
                                )}
                                <p className="mt-1 text-xs text-slate-500">
                                    {item.estoque === null
                                        ? "Estoque ilimitado"
                                        : `${item.estoque} restantes`}
                                    {item.dataFimCivil ? ` · válida até ${item.dataFimCivil}` : ""}
                                </p>
                                <button
                                    type="button"
                                    disabled={!disponivel || !saldoOk || resgatarId === item.id}
                                    onClick={() => setPendente(item)}
                                    className="mt-3 bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {item.situacao === "ESGOTADA"
                                        ? "Esgotada"
                                        : item.situacao === "EXPIRADA"
                                          ? "Expirada"
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
                                {item.status === "PENDENTE_ENTREGA"
                                    ? "Retire na loja"
                                    : item.status === "RECUSADO"
                                      ? "Recusado · pontos devolvidos"
                                      : "Entregue"}
                                {" · "}
                                {item.dataCriacao.toLocaleString("pt-BR")}
                                {item.dataEntrega
                                    ? ` · entregue em ${item.dataEntrega.toLocaleString("pt-BR")}`
                                    : ""}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {pendente ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-lg font-semibold">Confirmar resgate</h2>
                        <p className="mt-3 text-sm text-slate-700">
                            Recomendamos resgatar esta recompensa quando você estiver na loja. Após
                            o resgate, apresente a tela ao estabelecimento para confirmar a entrega.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            {pendente.nome} · {pendente.custoPontos} pontos
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setPendente(null)}
                                className="border border-slate-300 px-4 py-2 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={resgatarId === pendente.id}
                                onClick={() => confirmarResgate(pendente)}
                                className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                            >
                                {resgatarId === pendente.id ? "Resgatando..." : "Confirmar resgate"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
