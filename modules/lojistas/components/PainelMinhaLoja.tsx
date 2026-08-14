"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { listarAssociacoes } from "@/modules/associacoes/services/servicoAssociacao";
import { Associacao } from "@/modules/associacoes/types/associacao.types";
import { CardEnderecoLoja } from "@/modules/enderecos/components/CardEnderecoLoja";
import {
    atualizarLojista,
    buscarMeuPerfilLojista,
    criarLojista,
} from "@/modules/lojistas/services/servicoLojista";
import { Lojista, StatusLojista } from "@/modules/lojistas/types/lojista.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";

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

const MSG_REJEITADO = "Cadastro não aprovado";

const ROTULO_STATUS: Record<StatusLojista, string> = {
    PENDENTE: "Em análise",
    APROVADO: "Aprovada",
    REJEITADO: "Não aprovada",
};

const ESTILO_STATUS: Record<StatusLojista, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-900",
    APROVADO: "border-emerald-200 bg-emerald-50 text-emerald-900",
    REJEITADO: "border-red-200 bg-red-50 text-red-800",
};

function parseInscricaoEstadual(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isNaN(numero) ? undefined : numero;
}

function formularioDoPerfil(perfil: Lojista): FormState {
    return {
        nomeFantasia: perfil.nomeFantasia,
        razaoSocial: perfil.razaoSocial,
        cnpj: perfil.cnpj,
        inscricaoEstadual:
            perfil.inscricaoEstadual != null ? String(perfil.inscricaoEstadual) : "",
        associacaoId: String(perfil.associacaoId),
    };
}

export function PainelMinhaLoja() {
    const [perfil, setPerfil] = useState<Lojista | null>(null);
    const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState<FormState>(formInicial);

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const [meu, listaAssoc] = await Promise.all([
                    buscarMeuPerfilLojista(),
                    listarAssociacoes(),
                ]);
                if (cancelado) return;
                setPerfil(meu);
                setAssociacoes(listaAssoc);
            } catch (error) {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(
                            error,
                            "Erro ao carregar dados da loja.",
                        ),
                    );
                }
            } finally {
                if (!cancelado) setCarregando(false);
            }
        }

        void carregar();
        return () => {
            cancelado = true;
        };
    }, []);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setErro("");
        setAviso("");

        const associacaoId = Number(form.associacaoId);
        if (!Number.isInteger(associacaoId) || associacaoId <= 0) {
            setErro("Selecione a associação.");
            return;
        }

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);
        try {
            const criado = await criarLojista({
                nomeFantasia: form.nomeFantasia.trim(),
                razaoSocial: form.razaoSocial.trim(),
                cnpj: form.cnpj.trim(),
                inscricaoEstadual,
                associacaoId,
            });
            setPerfil(criado);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao enviar cadastro da loja."));
        } finally {
            setSalvando(false);
        }
    }

    /** Endereço recém-criado passa a ser o endereço da loja (`lojista.enderecoId`). */
    async function vincularEnderecoAoLojista(enderecoId: number) {
        if (!perfil || perfil.enderecoId === enderecoId) {
            return;
        }

        const atualizado = await atualizarLojista(perfil.id, {
            nomeFantasia: perfil.nomeFantasia,
            razaoSocial: perfil.razaoSocial,
            cnpj: perfil.cnpj,
            inscricaoEstadual: perfil.inscricaoEstadual,
            enderecoId,
        });
        setPerfil(atualizado);
    }

    function abrirEdicao() {
        if (!perfil) return;
        setForm(formularioDoPerfil(perfil));
        setErro("");
        setAviso("");
        setEditando(true);
    }

    async function handleEditar(event: FormEvent) {
        event.preventDefault();
        if (!perfil) return;

        setErro("");
        setAviso("");

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);
        try {
            const atualizado = await atualizarLojista(perfil.id, {
                nomeFantasia: form.nomeFantasia.trim(),
                razaoSocial: form.razaoSocial.trim(),
                cnpj: form.cnpj.trim(),
                inscricaoEstadual,
            });
            setPerfil(atualizado);
            setEditando(false);
            setAviso("Cadastro atualizado.");
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar dados da loja."));
        } finally {
            setSalvando(false);
        }
    }

    if (carregando) {
        return <p className="text-sm text-muted">Carregando…</p>;
    }

    return (
        <section className="mx-auto max-w-xl space-y-5">
            <header>
                <h1 className="text-2xl font-semibold text-slate-900">Minha loja</h1>
                <p className="mt-1 text-sm text-muted">
                    Cadastro e status da sua loja junto à associação comercial.
                </p>
            </header>

            {erro ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            {aviso ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {aviso}
                </div>
            ) : null}

            {!perfil ? (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-6 shadow-sm"
                >
                    <p className="text-sm text-slate-600">
                        Preencha os dados da loja para solicitar o{" "}
                        <strong>pré-cadastro</strong>. A associação analisa e aprova
                        ou recusa a solicitação.
                    </p>

                    <label className="block text-sm font-medium text-slate-700">
                        Associação
                        <select
                            value={form.associacaoId}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, associacaoId: e.target.value }))
                            }
                            className="mt-1 w-full border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                            required
                        >
                            <option value="">Selecione…</option>
                            {associacoes.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.nomeFantasia}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        Nome fantasia
                        <input
                            value={form.nomeFantasia}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, nomeFantasia: e.target.value }))
                            }
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            required
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        Razão social
                        <input
                            value={form.razaoSocial}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, razaoSocial: e.target.value }))
                            }
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            required
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        CNPJ
                        <input
                            value={form.cnpj}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, cnpj: e.target.value }))
                            }
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            required
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        Inscrição estadual (opcional)
                        <input
                            value={form.inscricaoEstadual}
                            onChange={(e) =>
                                setForm((a) => ({
                                    ...a,
                                    inscricaoEstadual: e.target.value,
                                }))
                            }
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={salvando}
                        className="w-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {salvando ? "Enviando…" : "Enviar pré-cadastro"}
                    </button>
                </form>
            ) : editando ? (
                <FormularioEdicao
                    form={form}
                    salvando={salvando}
                    onChange={setForm}
                    onCancelar={() => setEditando(false)}
                    onSubmit={handleEditar}
                />
            ) : (
                <StatusPerfil loja={perfil} onEditar={abrirEdicao} />
            )}

            {perfil ? (
                <CardEnderecoLoja
                    usuarioId={perfil.usuarioId}
                    enderecoVinculadoId={perfil.enderecoId}
                    onEnderecoCriado={vincularEnderecoAoLojista}
                />
            ) : null}
        </section>
    );
}

function FormularioEdicao({
    form,
    salvando,
    onChange,
    onCancelar,
    onSubmit,
}: {
    form: FormState;
    salvando: boolean;
    onChange: (atualizar: (atual: FormState) => FormState) => void;
    onCancelar: () => void;
    onSubmit: (event: FormEvent) => void;
}) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-6 shadow-sm"
        >
            <p className="text-sm text-slate-600">
                Corrija os dados enviados à associação. A associação continua sendo a
                mesma do pré-cadastro.
            </p>

            <label className="block text-sm font-medium text-slate-700">
                Nome fantasia
                <input
                    value={form.nomeFantasia}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, nomeFantasia: e.target.value }))
                    }
                    className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-slate-700">
                Razão social
                <input
                    value={form.razaoSocial}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, razaoSocial: e.target.value }))
                    }
                    className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-slate-700">
                CNPJ
                <input
                    value={form.cnpj}
                    onChange={(e) => onChange((a) => ({ ...a, cnpj: e.target.value }))}
                    className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-slate-700">
                Inscrição estadual (opcional)
                <input
                    value={form.inscricaoEstadual}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, inscricaoEstadual: e.target.value }))
                    }
                    className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                />
            </label>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={salvando}
                    className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={salvando}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {salvando ? "Salvando…" : "Salvar"}
                </button>
            </div>
        </form>
    );
}

function StatusPerfil({ loja, onEditar }: { loja: Lojista; onEditar: () => void }) {
    const status = loja.status;

    return (
        <div className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-6 shadow-sm">
            <div>
                <p className="text-lg font-semibold text-slate-900">{loja.nomeFantasia}</p>
                <p className="text-sm text-muted">{loja.razaoSocial}</p>
                <p className="mt-1 text-sm text-slate-600">CNPJ: {loja.cnpj}</p>
            </div>

            <p
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${ESTILO_STATUS[status]}`}
            >
                Situação: {ROTULO_STATUS[status]}
            </p>

            {status === "PENDENTE" ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Pré-cadastro enviado. Aguarde a associação aprovar ou recusar. Você
                    ainda pode corrigir os dados enquanto aguarda.
                </p>
            ) : null}

            {status === "APROVADO" ? (
                <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    <p>Sua loja foi aprovada. Você já pode cadastrar produtos e missões.</p>
                    <Link
                        href="/produtos"
                        className="inline-block font-semibold text-emerald-800 underline"
                    >
                        Ir para Produtos
                    </Link>
                </div>
            ) : null}

            {status === "REJEITADO" ? (
                <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="font-semibold">{MSG_REJEITADO}</p>
                    {loja.justificativaRejeicao ? (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                                Motivo informado pela associação
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">{loja.justificativaRejeicao}</p>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <button
                type="button"
                onClick={onEditar}
                className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
                Editar dados da loja
            </button>
        </div>
    );
}
