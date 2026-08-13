"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarConsumidores } from "../services/servicoConsumidor";
import { Consumidor } from "../types/consumidor.types";
import { TabelaConsumidores } from "./TabelaConsumidores";

/**
 * Somente leitura: o backend escopa a lista pelo lojista do JWT e reserva
 * criação/edição/exclusão do perfil ao próprio consumidor.
 */
export function PainelConsumidoresDaLoja() {
    const [consumidores, setConsumidores] = useState<Consumidor[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        listarConsumidores()
            .then((lista) => {
                if (!cancelado) {
                    setConsumidores(lista);
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

    return (
        <section className="space-y-5">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Consumidores da loja</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Consumidores vinculados à sua loja. O cadastro é feito pelo próprio
                    consumidor.
                </p>
            </div>

            {erro ? (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-x-auto">
                <TabelaConsumidores
                    consumidores={consumidores}
                    carregando={carregando}
                />
            </div>
        </section>
    );
}
