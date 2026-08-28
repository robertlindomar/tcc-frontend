"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    desativarRecompensa,
    listarRecompensasDaLoja,
    reativarRecompensa,
} from "../services/servicoRecompensa";
import { Recompensa, SituacaoRecompensa } from "../types/recompensa.types";

function rotuloSituacao(situacao: SituacaoRecompensa) {
    if (situacao === "DESATIVADA") return "Desativada";
    if (situacao === "EXPIRADA") return "Expirada";
    if (situacao === "ESGOTADA") return "Esgotada";
    return "Disponível";
}

function rotuloEstoque(estoque: number | null) {
    return estoque === null ? "Ilimitado" : String(estoque);
}

type PainelRecompensasLojaAssociacaoProps = {
    lojistaId: number;
};

export function PainelRecompensasLojaAssociacao({
    lojistaId,
}: PainelRecompensasLojaAssociacaoProps) {
    const [lista, setLista] = useState<Recompensa[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [acaoId, setAcaoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const itens = await listarRecompensasDaLoja(lojistaId);
                if (!cancelado) {
                    setLista(itens);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(error, "Erro ao carregar recompensas da loja."),
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
    }, [lojistaId]);

    async function handleDesativar(item: Recompensa) {
        setErro("");
        setAcaoId(item.id);
        try {
            const atualizado = await desativarRecompensa(item.id);
            setLista((atual) =>
                atual.map((r) => (r.id === atualizado.id ? atualizado : r)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao desativar."));
        } finally {
            setAcaoId(null);
        }
    }

    async function handleReativar(item: Recompensa) {
        setErro("");
        setAcaoId(item.id);
        try {
            const atualizado = await reativarRecompensa(item.id);
            setLista((atual) =>
                atual.map((r) => (r.id === atualizado.id ? atualizado : r)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao reativar."));
        } finally {
            setAcaoId(null);
        }
    }

    return (
        <div className="space-y-3">
            <p className="text-sm text-slate-600">
                Gerencie as recompensas cadastradas por esta loja. Reativar não altera
                validade nem estoque.
            </p>

            {erro ? (
                <div className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-x-auto border border-slate-200">
                <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-slate-50 text-slate-700">
                        <tr>
                            <th className="px-3 py-2 text-left font-semibold">Nome</th>
                            <th className="px-3 py-2 text-left font-semibold">Pontos</th>
                            <th className="px-3 py-2 text-left font-semibold">Estoque</th>
                            <th className="px-3 py-2 text-left font-semibold">Situação</th>
                            <th className="px-3 py-2 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {carregando ? (
                            <tr>
                                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                                    Carregando...
                                </td>
                            </tr>
                        ) : null}
                        {!carregando && lista.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                                    Nenhuma recompensa cadastrada.
                                </td>
                            </tr>
                        ) : null}
                        {!carregando &&
                            lista.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 font-medium">{item.nome}</td>
                                    <td className="px-3 py-2">{item.custoPontos}</td>
                                    <td className="px-3 py-2">{rotuloEstoque(item.estoque)}</td>
                                    <td className="px-3 py-2">{rotuloSituacao(item.situacao)}</td>
                                    <td className="px-3 py-2 text-right">
                                        {item.ativa ? (
                                            <button
                                                type="button"
                                                disabled={acaoId === item.id}
                                                onClick={() => void handleDesativar(item)}
                                                className="border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                                            >
                                                {acaoId === item.id ? "..." : "Desativar"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={acaoId === item.id}
                                                onClick={() => void handleReativar(item)}
                                                className="border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                                            >
                                                {acaoId === item.id ? "..." : "Reativar"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
