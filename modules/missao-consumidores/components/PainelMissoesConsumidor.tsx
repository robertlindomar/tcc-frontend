"use client";

import { FormEvent, useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    concluirMissao,
    listarMissoesConcluidas,
} from "../services/servicoMissaoConsumidor";
import { MissaoConsumidor } from "../types/missao-consumidor.types";
import { TabelaMissoesConcluidas } from "./TabelaMissoesConcluidas";

type StatusConsumidor = {
    pontos: number;
    nivel: number;
};

export function PainelMissoesConsumidor() {
    const [historico, setHistorico] = useState<MissaoConsumidor[]>([]);
    const [statusConsumidor, setStatusConsumidor] =
        useState<StatusConsumidor | null>(null);
    const [missaoId, setMissaoId] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [concluindo, setConcluindo] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        let cancelado = false;

        listarMissoesConcluidas()
            .then((lista) => {
                if (!cancelado) {
                    setHistorico(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(
                            error,
                            "Erro ao carregar histórico de missões.",
                        ),
                    );
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

    async function handleConcluir(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setSucesso("");

        const id = Number(missaoId);
        if (!Number.isInteger(id) || id <= 0) {
            setErro("Informe um ID de missão válido.");
            return;
        }

        setConcluindo(true);

        try {
            const resposta = await concluirMissao({ missaoId: id });
            setHistorico((lista) => [resposta.missaoConsumidor, ...lista]);
            setStatusConsumidor({
                pontos: resposta.consumidor.pontos,
                nivel: resposta.consumidor.nivel,
            });
            setSucesso(
                `Missão "${resposta.missaoConsumidor.nomeMissao}" concluída (+${resposta.missaoConsumidor.pontoRecompensa} pts).`,
            );
            setMissaoId("");
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao concluir missão."));
        } finally {
            setConcluindo(false);
        }
    }

    return (
        <section className="space-y-5">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Missões concluídas</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Conclua missões informando o ID e acompanhe pontos, nível e
                    histórico.
                </p>
            </div>

            {statusConsumidor && (
                <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                    <span className="font-semibold">Seu progresso:</span>{" "}
                    {statusConsumidor.pontos} pontos · nível{" "}
                    {statusConsumidor.nivel}
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

            <form
                onSubmit={handleConcluir}
                className="flex flex-col gap-3 border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
            >
                <label className="block flex-1 text-sm font-medium text-slate-700">
                    ID da missão
                    <input
                        type="number"
                        min={1}
                        step={1}
                        value={missaoId}
                        onChange={(event) => setMissaoId(event.target.value)}
                        placeholder="Ex.: 1"
                        className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={concluindo}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {concluindo ? "Concluindo..." : "Concluir"}
                </button>
            </form>

            <div className="overflow-x-auto">
                <TabelaMissoesConcluidas
                    missoes={historico}
                    carregando={carregando}
                />
            </div>
        </section>
    );
}
