"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { listarSexos } from "@/modules/sexos/services/servicoSexo";
import { Sexo } from "@/modules/sexos/types/sexo.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarConsumidor,
    criarConsumidor,
    deletarConsumidor,
    listarConsumidores,
} from "../services/servicoConsumidor";
import { Consumidor } from "../types/consumidor.types";
import { TabelaConsumidores } from "./TabelaConsumidores";

type FormState = {
    cpf: string;
    sexoId: string;
    lojistaId: string;
};

const formInicial: FormState = {
    cpf: "",
    sexoId: "",
    lojistaId: "",
};

function parseIdOpcional(valor: string): number | null {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isNaN(numero) ? null : numero;
}

export function CrudConsumidores() {
    const [consumidores, setConsumidores] = useState<Consumidor[]>([]);
    const [sexos, setSexos] = useState<Sexo[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [consumidorEditando, setConsumidorEditando] = useState<Consumidor | null>(
        null,
    );
    const [consumidorExcluindo, setConsumidorExcluindo] =
        useState<Consumidor | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (consumidorEditando ? "Editar consumidor" : "Novo consumidor"),
        [consumidorEditando],
    );

    useEffect(() => {
        let cancelado = false;

        Promise.all([listarConsumidores(), listarSexos()])
            .then(([listaConsumidores, listaSexos]) => {
                if (!cancelado) {
                    setConsumidores(listaConsumidores);
                    setSexos(listaSexos);
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

    function abrirCriacao() {
        setConsumidorEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(consumidor: Consumidor) {
        setConsumidorEditando(consumidor);
        setForm({
            cpf: consumidor.cpf,
            sexoId: consumidor.sexoId != null ? String(consumidor.sexoId) : "",
            lojistaId:
                consumidor.lojistaId != null ? String(consumidor.lojistaId) : "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setConsumidorEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setSalvando(true);

        const sexoId = parseIdOpcional(form.sexoId);
        const lojistaId = parseIdOpcional(form.lojistaId);

        try {
            if (consumidorEditando) {
                const atualizado = await atualizarConsumidor(consumidorEditando.id, {
                    cpf: form.cpf,
                    sexoId,
                    lojistaId,
                });

                setConsumidores((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarConsumidor({
                    cpf: form.cpf,
                    sexoId,
                    lojistaId,
                });
                setConsumidores((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar consumidor."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!consumidorExcluindo) {
            return;
        }

        setExcluindoId(consumidorExcluindo.id);
        setErro("");

        try {
            await deletarConsumidor(consumidorExcluindo.id);
            setConsumidores((lista) =>
                lista.filter((item) => item.id !== consumidorExcluindo.id),
            );
            setConsumidorExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir consumidor."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Consumidores</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Perfil de consumidor. O usuário precisa ter endereço cadastrado.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Novo consumidor
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaConsumidores
                    consumidores={consumidores}
                    onEditar={abrirEdicao}
                    onExcluir={setConsumidorExcluindo}
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
                                    {consumidorEditando
                                        ? "Altere CPF e vínculos opcionais."
                                        : "Vincula o perfil ao usuário autenticado (JWT). Endereço obrigatório."}
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
                                CPF
                                <input
                                    type="text"
                                    value={form.cpf}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            cpf: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Sexo (opcional)
                                <select
                                    value={form.sexoId}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            sexoId: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                >
                                    <option value="">Nenhum</option>
                                    {sexos.map((sexo) => (
                                        <option key={sexo.id} value={sexo.id}>
                                            {sexo.nome}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                ID do lojista (opcional, deve estar APROVADO)
                                <input
                                    type="number"
                                    value={form.lojistaId}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            lojistaId: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    min={1}
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

            {consumidorExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir consumidor
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão do consumidor CPF {consumidorExcluindo.cpf}?
                            Essa ação não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setConsumidorExcluindo(null)}
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
