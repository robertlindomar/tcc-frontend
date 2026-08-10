"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarCampanha,
    criarCampanha,
    deletarCampanha,
    listarCampanhas,
} from "../services/servicoCampanha";
import { Campanha } from "../types/campanha.types";
import { TabelaCampanhas } from "./TabelaCampanhas";

type FormState = {
    nome: string;
    descricao: string;
    qrcode: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    qrcode: "",
};

export function CrudCampanhas() {
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [campanhaEditando, setCampanhaEditando] = useState<Campanha | null>(null);
    const [campanhaExcluindo, setCampanhaExcluindo] = useState<Campanha | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (campanhaEditando ? "Editar campanha" : "Nova campanha"),
        [campanhaEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarCampanhas()
            .then((lista) => {
                if (!cancelado) {
                    setCampanhas(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar campanhas."));
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

    function abrirCriacao() {
        setCampanhaEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(campanha: Campanha) {
        setCampanhaEditando(campanha);
        setForm({
            nome: campanha.nome,
            descricao: campanha.descricao ?? "",
            qrcode: campanha.qrcode ?? "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setCampanhaEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const nome = form.nome.trim();
        if (!nome) {
            setErro("Nome é obrigatório.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome,
                descricao: form.descricao.trim() || null,
                qrcode: form.qrcode.trim() || null,
            };

            if (campanhaEditando) {
                const atualizado = await atualizarCampanha(campanhaEditando.id, dados);
                setCampanhas((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarCampanha(dados);
                setCampanhas((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar campanha."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!campanhaExcluindo) {
            return;
        }

        setExcluindoId(campanhaExcluindo.id);
        setErro("");

        try {
            await deletarCampanha(campanhaExcluindo.id);
            setCampanhas((lista) =>
                lista.filter((item) => item.id !== campanhaExcluindo.id),
            );
            setCampanhaExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir campanha."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Campanhas</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de campanhas.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Nova campanha
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaCampanhas
                    campanhas={campanhas}
                    onEditar={abrirEdicao}
                    onExcluir={setCampanhaExcluindo}
                    carregando={carregando}
                    excluindoId={excluindoId}
                />
            </div>

            {modalAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-lg bg-white p-6 shadow-xl">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {tituloModal}
                                </h2>
                                <p className="mt-1 text-sm text-slate-600">
                                    {campanhaEditando
                                        ? "Altere os dados da campanha."
                                        : "Informe os dados para cadastrar uma campanha."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fecharModal}
                                className="px-2 py-1 text-2xl leading-none text-slate-500 hover:text-slate-900"
                                aria-label="Fechar modal"
                            >
                                x
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">
                                Nome
                                <input
                                    type="text"
                                    value={form.nome}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            nome: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Descrição (opcional)
                                <textarea
                                    value={form.descricao}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            descricao: event.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                QR Code (opcional)
                                <input
                                    type="text"
                                    value={form.qrcode}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            qrcode: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </label>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    disabled={salvando}
                                    className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {salvando ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {campanhaExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir campanha
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {campanhaExcluindo.nome}? Essa ação
                            não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setCampanhaExcluindo(null)}
                                disabled={excluindoId !== null}
                                className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={confirmarExclusao}
                                disabled={excluindoId !== null}
                                className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {excluindoId ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
