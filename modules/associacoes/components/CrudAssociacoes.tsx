"use client";

import { FormEvent, useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { atualizarAssociacao, listarAssociacoes } from "../services/servicoAssociacao";
import { Associacao } from "../types/associacao.types";
import { TabelaAssociacoes } from "./TabelaAssociacoes";

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

function parseInscricaoEstadual(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isNaN(numero) ? undefined : numero;
}

/**
 * `GET /associacao` já devolve somente a associação do usuário logado. Criar
 * outra não faz sentido (é 1:1 com a conta) e excluir sairia do ar sozinho, por
 * isso a tela só lista e edita.
 */
export function CrudAssociacoes() {
    const [associacoes, setAssociacoes] = useState<Associacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [associacaoEditando, setAssociacaoEditando] = useState<Associacao | null>(
        null,
    );
    const [form, setForm] = useState<FormState>(formInicial);

    useEffect(() => {
        let cancelado = false;

        listarAssociacoes()
            .then((lista) => {
                if (!cancelado) {
                    setAssociacoes(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(error, "Erro ao carregar a associação."),
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

    function abrirEdicao(associacao: Associacao) {
        setAssociacaoEditando(associacao);
        setForm({
            nomeFantasia: associacao.nomeFantasia,
            razaoSocial: associacao.razaoSocial,
            cnpj: associacao.cnpj,
            inscricaoEstadual:
                associacao.inscricaoEstadual != null
                    ? String(associacao.inscricaoEstadual)
                    : "",
        });
        setErro("");
        setAviso("");
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setAssociacaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        if (!associacaoEditando) {
            return;
        }

        const inscricaoEstadual = parseInscricaoEstadual(form.inscricaoEstadual);
        if (inscricaoEstadual === undefined) {
            setErro("Inscrição estadual inválida.");
            return;
        }

        setSalvando(true);

        try {
            const atualizado = await atualizarAssociacao(associacaoEditando.id, {
                nomeFantasia: form.nomeFantasia,
                razaoSocial: form.razaoSocial,
                cnpj: form.cnpj,
                inscricaoEstadual,
            });

            setAssociacoes((lista) =>
                lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
            );
            setAssociacaoEditando(null);
            setForm(formInicial);
            setAviso("Dados da associação atualizados.");
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar a associação."));
        } finally {
            setSalvando(false);
        }
    }

    const classeCampo =
        "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-navy outline-none focus:border-primary";

    return (
        <div className="painel-pagina space-y-6">
            <div>
                <p className="painel-eyebrow">Associação</p>
                <h1 className="painel-titulo">Minha associação</h1>
                <p className="painel-subtitulo">
                    Dados cadastrais da associação que você administra.
                </p>
            </div>

            {erro ? (
                <div className="painel-card border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            {aviso ? (
                <div className="painel-card border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {aviso}
                </div>
            ) : null}

            <TabelaAssociacoes
                associacoes={associacoes}
                onEditar={abrirEdicao}
                carregando={carregando}
            />

            {associacaoEditando ? (
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">
                                Editar associação
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                Altere os dados da associação.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fecharModal}
                            className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy"
                            aria-label="Fechar"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block text-sm font-medium text-navy">
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
                                className={classeCampo}
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
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
                                className={classeCampo}
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
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
                                className={classeCampo}
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
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
                                className={classeCampo}
                            />
                        </label>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={fecharModal}
                                disabled={salvando}
                                className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={salvando}
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            ) : null}
        </div>
    );
}
