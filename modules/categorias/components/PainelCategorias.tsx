"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarCategorias } from "../services/servicoCategoria";
import { Categoria } from "../types/categoria.types";

/**
 * Catálogo global somente leitura: o backend recusa escrita de categoria para
 * todos os papéis atuais, então a tela não oferece criar/editar/excluir.
 */
export function PainelCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let cancelado = false;

        listarCategorias()
            .then((lista) => {
                if (!cancelado) setCategorias(lista);
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar categorias."));
                }
            })
            .finally(() => {
                if (!cancelado) setCarregando(false);
            });

        return () => {
            cancelado = true;
        };
    }, []);

    return (
        <section className="space-y-5">
            <div className="border-b border-slate-200 pb-5">
                <h1 className="text-2xl font-bold">Categorias</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Catálogo de categorias de produtos, mantido pela plataforma.
                </p>
            </div>

            {erro ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {carregando ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500">
                                    Carregando…
                                </td>
                            </tr>
                        ) : null}
                        {!carregando && categorias.length === 0 ? (
                            <tr>
                                <td className="px-4 py-8 text-center text-slate-500">
                                    Nenhuma categoria cadastrada.
                                </td>
                            </tr>
                        ) : null}
                        {categorias.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{item.nome}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
