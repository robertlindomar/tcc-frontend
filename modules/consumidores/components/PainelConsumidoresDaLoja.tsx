"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarConsumidores } from "../services/servicoConsumidor";
import { ListagemVisitantesLoja } from "../types/consumidor.types";
import { TabelaConsumidores } from "./TabelaConsumidores";

/**
 * Somente leitura: visitantes da missão sistema "Visitar loja" da loja autenticada.
 * Consumidor.lojistaId é legado e não define esta lista.
 */
export function PainelConsumidoresDaLoja() {
    const [listagem, setListagem] = useState<ListagemVisitantesLoja>({
        consumidores: [],
        consumidoresUnicos: 0,
        totalVisitas: 0,
    });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        listarConsumidores()
            .then((dados) => {
                if (!cancelado) {
                    setListagem(dados);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(error, "Erro ao carregar consumidores."),
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

    const resumo =
        listagem.consumidoresUnicos === 1
            ? `1 consumidor · ${listagem.totalVisitas} ${listagem.totalVisitas === 1 ? "visita" : "visitas"}`
            : `${listagem.consumidoresUnicos} consumidores · ${listagem.totalVisitas} visitas`;

    return (
        <section className="space-y-5">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Consumidores da loja</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Consumidores que visitaram sua loja pelo aplicativo
                </p>
                {!carregando && !erro ? (
                    <p className="mt-2 text-sm font-medium text-slate-700">{resumo}</p>
                ) : null}
            </div>

            {erro ? (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-x-auto">
                <TabelaConsumidores
                    consumidores={listagem.consumidores}
                    carregando={carregando}
                />
            </div>
        </section>
    );
}
