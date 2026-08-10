"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { listarCampanhas } from "@/modules/campanhas/services/servicoCampanha";
import { Campanha } from "@/modules/campanhas/types/campanha.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarSorteio,
    criarSorteio,
    deletarSorteio,
    listarSorteios,
} from "../services/servicoSorteio";
import { Sorteio } from "../types/sorteio.types";
import { TabelaSorteios } from "./TabelaSorteios";

type FormState = {
    campanhaId: string;
    qrcode: string;
};

const formInicial: FormState = {
    campanhaId: "",
    qrcode: "",
};

export function CrudSorteios() {
    const [sorteios, setSorteios] = useState<Sorteio[]>([]);
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [sorteioEditando, setSorteioEditando] = useState<Sorteio | null>(null);
    const [sorteioExcluindo, setSorteioExcluindo] = useState<Sorteio | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (sorteioEditando ? "Editar sorteio" : "Novo sorteio"),
        [sorteioEditando],
    );

    const nomeCampanhaPorId = useMemo(() => {
        const mapa: Record<number, string> = {};
        for (const campanha of campanhas) {
            mapa[campanha.id] = campanha.nome;
        }
        return mapa;
    }, [campanhas]);

    useEffect(() => {
        let cancelado = false;

        Promise.all([listarSorteios(), listarCampanhas()])
            .then(([listaSorteios, listaCampanhas]) => {
                if (!cancelado) {
                    setSorteios(listaSorteios);
                    setCampanhas(listaCampanhas);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar sorteios."));
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
        setSorteioEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(sorteio: Sorteio) {
        setSorteioEditando(sorteio);
        setForm({
            campanhaId: String(sorteio.campanhaId),
            qrcode: sorteio.qrcode ?? "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setSorteioEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const campanhaId = Number(form.campanhaId);
        if (!Number.isInteger(campanhaId) || campanhaId <= 0) {
            setErro("Selecione uma campanha.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                campanhaId,
                qrcode: form.qrcode.trim() || null,
            };

            if (sorteioEditando) {
                const atualizado = await atualizarSorteio(sorteioEditando.id, dados);
                setSorteios((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarSorteio(dados);
                setSorteios((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar sorteio."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!sorteioExcluindo) {
            return;
        }

        setExcluindoId(sorteioExcluindo.id);
        setErro("");

        try {
            await deletarSorteio(sorteioExcluindo.id);
            setSorteios((lista) =>
                lista.filter((item) => item.id !== sorteioExcluindo.id),
            );
            setSorteioExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir sorteio."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Sorteios</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de sorteios.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Novo sorteio
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaSorteios
                    sorteios={sorteios}
                    nomeCampanhaPorId={nomeCampanhaPorId}
                    onEditar={abrirEdicao}
                    onExcluir={setSorteioExcluindo}
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
                                    {sorteioEditando
                                        ? "Altere os dados do sorteio."
                                        : "Informe os dados para cadastrar um sorteio."}
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
                                Campanha
                                <select
                                    value={form.campanhaId}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            campanhaId: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                >
                                    <option value="">Selecione uma campanha</option>
                                    {campanhas.map((campanha) => (
                                        <option key={campanha.id} value={campanha.id}>
                                            {campanha.nome}
                                        </option>
                                    ))}
                                </select>
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

            {sorteioExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir sorteio
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão do sorteio da campanha{" "}
                            {nomeCampanhaPorId[sorteioExcluindo.campanhaId] ??
                                `#${sorteioExcluindo.campanhaId}`}
                            ? Essa ação não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSorteioExcluindo(null)}
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
