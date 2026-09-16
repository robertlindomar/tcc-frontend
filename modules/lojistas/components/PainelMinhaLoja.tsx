"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CardEnderecoLoja } from "@/modules/enderecos/components/CardEnderecoLoja";
import {
    atualizarLojista,
    buscarMeuPerfilLojista,
    criarLojista,
    reenviarLojistaParaAnalise,
} from "@/modules/lojistas/services/servicoLojista";
import { Lojista, StatusLojista } from "@/modules/lojistas/types/lojista.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { ModalConfirmarReenvio } from "./ModalConfirmarReenvio";

type FormState = {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual: string;
};

const formInicial: FormState = {
    nomeFantasia: "",
    razaoSocial: "",
    cnpj: "",
    inscricaoEstadual: "",
};

const MSG_REJEITADO = "Cadastro rejeitado";

const ROTULO_STATUS: Record<StatusLojista, string> = {
    PENDENTE: "Em análise",
    APROVADO: "Aprovada",
    REJEITADO: "Não aprovada",
};

const ESTILO_STATUS: Record<StatusLojista, string> = {
    PENDENTE: "border-amber-200 bg-amber-50 text-amber-900",
    APROVADO: "border-primary/25 bg-primary-muted text-[#0c2f24]",
    REJEITADO: "border-[#ffc9c3] bg-[#fff5f3] text-[#b91c1c]",
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
    };
}

export function PainelMinhaLoja() {
    const [perfil, setPerfil] = useState<Lojista | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [reenviando, setReenviando] = useState(false);
    const [confirmarReenvio, setConfirmarReenvio] = useState(false);
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
                const meu = await buscarMeuPerfilLojista();
                if (cancelado) return;
                setPerfil(meu);
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
            });
            setPerfil(criado);
            setAviso("Cadastro enviado para análise.");
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

    async function confirmarEnvioParaAnalise() {
        if (!perfil) return;
        setErro("");
        setReenviando(true);
        try {
            const atualizado = await reenviarLojistaParaAnalise(perfil.id);
            setPerfil(atualizado);
            setConfirmarReenvio(false);
            setAviso("Cadastro enviado novamente para análise.");
        } catch (error) {
            setErro(
                obterMensagemErroApi(error, "Erro ao reenviar cadastro para análise."),
            );
        } finally {
            setReenviando(false);
        }
    }

    if (carregando) {
        return (
            <section className="painel-pagina">
                <p className="text-sm text-muted">Carregando…</p>
            </section>
        );
    }

    return (
        <section className="painel-pagina space-y-6">
            <header>
                <p className="painel-eyebrow">LOJISTA</p>
                <h1 className="painel-titulo">Minha loja</h1>
                <p className="painel-subtitulo">
                    Cadastro e status da sua loja junto à associação comercial.
                </p>
            </header>

            {erro ? (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            ) : null}

            {aviso ? (
                <div className="rounded-[var(--radius-sm)] border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-[#0c2f24]">
                    {aviso}
                </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
                {!perfil ? (
                    <form
                        onSubmit={handleSubmit}
                        className="painel-card space-y-4 p-6"
                    >
                        <p className="text-sm text-muted">
                            Preencha os dados da loja para solicitar o{" "}
                            <strong className="text-navy">pré-cadastro</strong>. A
                            associação analisa e aprova ou recusa a solicitação.
                        </p>

                        <label className="block text-sm font-medium text-navy">
                            Nome fantasia
                            <input
                                value={form.nomeFantasia}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, nomeFantasia: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Razão social
                            <input
                                value={form.razaoSocial}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, razaoSocial: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            CNPJ
                            <input
                                value={form.cnpj}
                                onChange={(e) =>
                                    setForm((a) => ({ ...a, cnpj: e.target.value }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Inscrição estadual (opcional)
                            <input
                                value={form.inscricaoEstadual}
                                onChange={(e) =>
                                    setForm((a) => ({
                                        ...a,
                                        inscricaoEstadual: e.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={salvando}
                            className="btn-primario w-full disabled:opacity-60"
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
                    <StatusPerfil
                        loja={perfil}
                        onEditar={abrirEdicao}
                        onReenviar={() => setConfirmarReenvio(true)}
                    />
                )}

                {perfil ? (
                    <CardEnderecoLoja
                        usuarioId={perfil.usuarioId}
                        enderecoVinculadoId={perfil.enderecoId}
                        onEnderecoCriado={vincularEnderecoAoLojista}
                    />
                ) : (
                    <div className="painel-card flex items-center justify-center p-6 text-sm text-muted lg:min-h-[280px]">
                        Cadastre a loja para informar o endereço.
                    </div>
                )}
            </div>

            {confirmarReenvio ? (
                <ModalConfirmarReenvio
                    salvando={reenviando}
                    onCancelar={() => {
                        if (!reenviando) setConfirmarReenvio(false);
                    }}
                    onConfirmar={() => void confirmarEnvioParaAnalise()}
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
            className="painel-card space-y-4 p-6"
        >
            <p className="text-sm text-muted">
                Corrija os dados enviados à associação. A associação continua sendo a
                mesma do pré-cadastro.
            </p>

            <label className="block text-sm font-medium text-navy">
                Nome fantasia
                <input
                    value={form.nomeFantasia}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, nomeFantasia: e.target.value }))
                    }
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-navy">
                Razão social
                <input
                    value={form.razaoSocial}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, razaoSocial: e.target.value }))
                    }
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-navy">
                CNPJ
                <input
                    value={form.cnpj}
                    onChange={(e) => onChange((a) => ({ ...a, cnpj: e.target.value }))}
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                    required
                />
            </label>

            <label className="block text-sm font-medium text-navy">
                Inscrição estadual (opcional)
                <input
                    value={form.inscricaoEstadual}
                    onChange={(e) =>
                        onChange((a) => ({ ...a, inscricaoEstadual: e.target.value }))
                    }
                    className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                />
            </label>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={salvando}
                    className="btn-secundario text-sm disabled:opacity-60"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={salvando}
                    className="btn-primario text-sm disabled:opacity-60"
                >
                    {salvando ? "Salvando…" : "Salvar"}
                </button>
            </div>
        </form>
    );
}

function StatusPerfil({
    loja,
    onEditar,
    onReenviar,
}: {
    loja: Lojista;
    onEditar: () => void;
    onReenviar: () => void;
}) {
    const status = loja.status;

    return (
        <div className="painel-card space-y-4 p-6">
            <div className="flex items-start gap-4">
                <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-muted text-primary"
                    aria-hidden
                >
                    <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
                        <path d="M9 21V12h6v9" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-lg font-semibold text-navy">{loja.nomeFantasia}</p>
                    <p className="text-sm text-muted">{loja.razaoSocial}</p>
                    <p className="mt-1 text-sm text-muted">CNPJ: {loja.cnpj}</p>
                </div>
            </div>

            <p
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${ESTILO_STATUS[status]}`}
            >
                Situação: {ROTULO_STATUS[status]}
            </p>

            {status === "PENDENTE" ? (
                <p className="rounded-[var(--radius-sm)] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Pré-cadastro enviado. Aguarde a associação aprovar ou recusar. Você
                    ainda pode corrigir os dados enquanto aguarda.
                </p>
            ) : null}

            {status === "APROVADO" ? (
                <div className="space-y-3 rounded-[var(--radius-sm)] border border-primary/20 bg-primary-muted px-4 py-3 text-sm text-[#0c2f24]">
                    <p>Sua loja foi aprovada. Você já pode cadastrar produtos e missões.</p>
                    <Link
                        href="/produtos"
                        className="inline-block font-semibold text-primary underline"
                    >
                        Ir para Produtos
                    </Link>
                </div>
            ) : null}

            {status === "REJEITADO" ? (
                <div className="space-y-3 rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    <p className="font-semibold">{MSG_REJEITADO}</p>
                    {loja.justificativaRejeicao ? (
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-coral">
                                Motivo
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">{loja.justificativaRejeicao}</p>
                        </div>
                    ) : null}
                    <button
                        type="button"
                        onClick={onReenviar}
                        className="btn-primario text-sm"
                    >
                        Enviar novamente para análise
                    </button>
                </div>
            ) : null}

            <button
                type="button"
                onClick={onEditar}
                className="btn-secundario text-sm"
            >
                Editar dados da loja
            </button>
        </div>
    );
}
