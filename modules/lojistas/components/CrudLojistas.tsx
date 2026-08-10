"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { buscarUsuarioLogadoAtual } from "@/modules/auth/services/servicoAuth";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    aprovarLojista,
    atualizarLojista,
    criarLojista,
    deletarLojista,
    listarLojistas,
    rejeitarLojista,
} from "../services/servicoLojista";
import { Lojista, StatusLojista } from "../types/lojista.types";
import { TabelaLojistas } from "./TabelaLojistas";

type FormState = {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: string;
    associacaoId: string;
};

const formInicial: FormState = {
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
    associacaoId: "",
};

type FiltroStatus = "" | StatusLojista;

function parseInscricaoEstadual(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isNaN(numero) ? undefined : numero;
}

export function CrudLojistas() {
    const papel = buscarUsuarioLogadoAtual()?.usuario?.role;
    const ehAssociacao = papel === "ASSOCIACAO";

    const [lojistas, setLojistas] = useState<Lojista[]>([]);
    const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>(
        ehAssociacao ? "PENDENTE" : "",
    );
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [acaoStatusId, setAcaoStatusId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [lojistaEditando, setLojistaEditando] = useState<Lojista | null>(null);
    const [lojistaExcluindo, setLojistaExcluindo] = useState<Lojista | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (lojistaEditando ? "Editar lojista" : "Novo lojista"),
        [lojistaEditando],
    );

    const carregarLista = useCallback(async () => {
        setCarregando(true);
        setErro("");

        try {
            const lista = await listarLojistas(
                filtroStatus ? { status: filtroStatus } : undefined,
            );
            setLojistas(lista);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao carregar lojistas."));
        } finally {
            setCarregando(false);
        }
    }, [filtroStatus]);

    useEffect(() => {
        void carregarLista();
    }, [carregarLista]);

    function abrirCriacao() {
        setLojistaEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(lojista: Lojista) {
        setLojistaEditando(lojista);
        setForm({
            nomeFantasia: lojista.nomeFantasia,
            razaoSocial: lojista.razaoSocial,
            cnpj: lojista.cnpj,
            inscricaoEstadual:
                lojista.inscricaoEstadual != null
                    ? String(lojista.inscricaoEstadual)
                    : "",
            associacaoId: String(lojista.associacaoId),
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setLojistaEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);

        try {
            if (lojistaEditando) {
                const atualizado = await atualizarLojista(lojistaEditando.id, {
                    nomeFantasia: form.nomeFantasia,
                    razaoSocial: form.razaoSocial,
                    cnpj: form.cnpj,
                    inscricaoEstadual,
                });

                setLojistas((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const associacaoId = Number(form.associacaoId);

                if (!associacaoId || Number.isNaN(associacaoId)) {
                    setErro("Informe uma associação válida.");
                    setSalvando(false);
                    return;
                }

                const criado = await criarLojista({
                    nomeFantasia: form.nomeFantasia,
                    razaoSocial: form.razaoSocial,
                    cnpj: form.cnpj,
                    inscricaoEstadual,
                    associacaoId,
                });
                setLojistas((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar lojista."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!lojistaExcluindo) {
            return;
        }

        setExcluindoId(lojistaExcluindo.id);
        setErro("");

        try {
            await deletarLojista(lojistaExcluindo.id);
            setLojistas((lista) =>
                lista.filter((item) => item.id !== lojistaExcluindo.id),
            );
            setLojistaExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir lojista."));
        } finally {
            setExcluindoId(null);
        }
    }

    async function handleAprovar(lojista: Lojista) {
        setAcaoStatusId(lojista.id);
        setErro("");

        try {
            const atualizado = await aprovarLojista(lojista.id);
            setLojistas((lista) =>
                lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao aprovar lojista."));
        } finally {
            setAcaoStatusId(null);
        }
    }

    async function handleRejeitar(lojista: Lojista) {
        setAcaoStatusId(lojista.id);
        setErro("");

        try {
            const atualizado = await rejeitarLojista(lojista.id);
            setLojistas((lista) =>
                lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
            );
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao rejeitar lojista."));
        } finally {
            setAcaoStatusId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        {ehAssociacao ? "Fila de aprovação" : "Lojistas"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        {ehAssociacao
                            ? "Analise solicitações de lojas da sua associação (PENDENTE)."
                            : "Cadastro de lojistas e fila de aprovação (PENDENTE)."}
                    </p>
                </div>

                {!ehAssociacao ? (
                    <button
                        type="button"
                        onClick={abrirCriacao}
                        className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Novo lojista
                    </button>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-slate-700">
                    Filtrar status
                    <select
                        value={filtroStatus}
                        onChange={(event) =>
                            setFiltroStatus(event.target.value as FiltroStatus)
                        }
                        className="ml-2 border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                    >
                        <option value="">Todos</option>
                        <option value="PENDENTE">Pendentes (fila)</option>
                        <option value="APROVADO">Aprovados</option>
                        <option value="REJEITADO">Rejeitados</option>
                    </select>
                </label>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaLojistas
                    lojistas={lojistas}
                    onEditar={abrirEdicao}
                    onExcluir={setLojistaExcluindo}
                    onAprovar={handleAprovar}
                    onRejeitar={handleRejeitar}
                    carregando={carregando}
                    excluindoId={excluindoId}
                    acaoStatusId={acaoStatusId}
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
                                    {lojistaEditando
                                        ? "Altere os dados da loja (status não muda aqui)."
                                        : "Novo lojista entra como PENDENTE."}
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
                                Nome fantasia
                                <input
                                    type="text"
                                    value={form.nomeFantasia}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            nomeFantasia: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Razão social
                                <input
                                    type="text"
                                    value={form.razaoSocial}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            razaoSocial: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                CNPJ
                                <input
                                    type="text"
                                    value={form.cnpj}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            cnpj: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                    required
                                />
                            </label>

                            <label className="block text-sm font-medium text-slate-700">
                                Inscrição estadual (opcional)
                                <input
                                    type="number"
                                    value={form.inscricaoEstadual}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            inscricaoEstadual: event.target.value,
                                        }))
                                    }
                                    className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                />
                            </label>

                            {!lojistaEditando && (
                                <label className="block text-sm font-medium text-slate-700">
                                    ID da associação
                                    <input
                                        type="number"
                                        value={form.associacaoId}
                                        onChange={(event) =>
                                            setForm((atual) => ({
                                                ...atual,
                                                associacaoId: event.target.value,
                                            }))
                                        }
                                        className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                                        required
                                        min={1}
                                    />
                                </label>
                            )}

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

            {lojistaExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir lojista
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {lojistaExcluindo.nomeFantasia}? Essa
                            ação não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setLojistaExcluindo(null)}
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
