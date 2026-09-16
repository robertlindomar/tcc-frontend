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
        <section className="painel-pagina space-y-6">
            <header>
                <p className="painel-eyebrow">LOJISTA</p>
                <h1 className="painel-titulo">Consumidores da loja</h1>
                <p className="painel-subtitulo">
                    Consumidores que visitaram sua loja pelo aplicativo
                </p>
                {!carregando && !erro ? (
                    <p className="mt-2 text-sm font-medium text-navy">{resumo}</p>
                ) : null}
            </header>

            {erro ? (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
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
