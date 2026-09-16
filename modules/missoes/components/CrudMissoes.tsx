"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import {
    atualizarMissao,
    criarMissao,
    deletarMissao,
    listarMissoes,
} from "../services/servicoMissao";
import { FrequenciaMissao, Missao } from "../types/missao.types";
import { ROTULOS_FREQUENCIA_MISSAO } from "../utils/rotulosMissao";
import { ModalQrMissao } from "./ModalQrMissao";
import { TabelaMissoes } from "./TabelaMissoes";

type FormState = {
    nome: string;
    descricao: string;
    pontoRecompensa: string;
    frequencia: FrequenciaMissao;
    dataFim: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    pontoRecompensa: "",
    frequencia: "UMA_VEZ",
    dataFim: "",
};

function parsePontoRecompensa(valor: string): number | undefined {
    const trim = valor.trim();
    if (!trim) {
        return undefined;
    }
    const numero = Number(trim);
    return Number.isInteger(numero) && numero >= 1 ? numero : undefined;
}

export function CrudMissoes() {
    const [missoes, setMissoes] = useState<Missao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [missaoEditando, setMissaoEditando] = useState<Missao | null>(null);
    const [missaoExcluindo, setMissaoExcluindo] = useState<Missao | null>(null);
    const [missaoQr, setMissaoQr] = useState<Missao | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (missaoEditando ? "Editar missão" : "Nova missão"),
        [missaoEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarMissoes()
            .then((lista) => {
                if (!cancelado) {
                    setMissoes(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar missões."));
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
        setMissaoEditando(null);
        setForm(formInicial);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(missao: Missao) {
        setMissaoEditando(missao);
        setForm({
            nome: missao.nome,
            descricao: missao.descricao ?? "",
            pontoRecompensa: String(missao.pontoRecompensa),
            frequencia: missao.frequencia,
            dataFim: missao.dataFimCivil ?? "",
        });
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setMissaoEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const pontoRecompensa = parsePontoRecompensa(form.pontoRecompensa);
        if (pontoRecompensa === undefined) {
            setErro("Informe os pontos da missão (mínimo 1).");
            return;
        }
        if (!form.dataFim) {
            setErro("Informe até quando a missão é válida.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome.trim(),
                descricao: form.descricao.trim() || null,
                pontoRecompensa,
                frequencia: form.frequencia,
                dataFim: form.dataFim,
            };

            if (missaoEditando) {
                const atualizado = await atualizarMissao(missaoEditando.id, dados);
                setMissoes((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                const criado = await criarMissao(dados);
                setMissoes((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar missão."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!missaoExcluindo) {
            return;
        }

        setExcluindoId(missaoExcluindo.id);
        setErro("");

        try {
            await deletarMissao(missaoExcluindo.id);
            setMissoes((lista) =>
                lista.filter((item) => item.id !== missaoExcluindo.id),
            );
            setMissaoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir missão."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">LOJISTA</p>
                    <h1 className="painel-titulo">Missões</h1>
                    <p className="painel-subtitulo">
                        Gerencie cadastro, edição e exclusão de missões.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="btn-primario"
                >
                    Nova missão
                </button>
            </div>

            {erro && (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaMissoes
                    missoes={missoes}
                    onEditar={abrirEdicao}
                    onExcluir={setMissaoExcluindo}
                    onVerQr={setMissaoQr}
                    carregando={carregando}
                    excluindoId={excluindoId}
                />
            </div>

            {modalAberto && (
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">
                                {tituloModal}
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                {missaoEditando
                                    ? "Altere os dados da missão."
                                    : "Informe os dados para cadastrar uma missão."}
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
                        <label className="block text-sm font-medium text-navy">
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
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Pontos da missão *
                            <input
                                type="number"
                                min={1}
                                step={1}
                                required
                                value={form.pontoRecompensa}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        pontoRecompensa: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Frequência
                            <select
                                value={form.frequencia}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        frequencia: event.target
                                            .value as FrequenciaMissao,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            >
                                {(
                                    Object.entries(ROTULOS_FREQUENCIA_MISSAO) as [
                                        FrequenciaMissao,
                                        string,
                                    ][]
                                ).map(([valor, rotulo]) => (
                                    <option key={valor} value={valor}>
                                        {rotulo}
                                    </option>
                                ))}
                            </select>
                            <span className="mt-1 block text-xs font-normal text-muted">
                                Depois da primeira conclusão, a frequência não
                                pode mais ser alterada.
                            </span>
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Válida até
                            <input
                                type="date"
                                value={form.dataFim}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        dataFim: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
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
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
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
            )}

            {missaoQr && (
                <ModalQrMissao missao={missaoQr} onFechar={() => setMissaoQr(null)} />
            )}

            {missaoExcluindo && (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            setMissaoExcluindo(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">
                        Excluir missão
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Confirma a exclusão de {missaoExcluindo.nome}? Essa ação
                        não poderá ser desfeita.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setMissaoExcluindo(null)}
                            disabled={excluindoId !== null}
                            className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={confirmarExclusao}
                            disabled={excluindoId !== null}
                            className="btn-perigo text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {excluindoId ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </ModalOverlay>
            )}
        </section>
    );
}
