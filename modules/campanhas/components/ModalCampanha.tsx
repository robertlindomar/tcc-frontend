"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { ConteudoResultadoSorteio } from "@/modules/sorteios/components/ConteudoResultadoSorteio";
import { buscarSorteioPorId } from "@/modules/sorteios/services/servicoSorteio";
import { Sorteio } from "@/modules/sorteios/types/sorteio.types";
import { CampoData } from "@/shared/components/ui/CampoData";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { validarDataNaoPassada } from "@/shared/utils/dataCivil";
import { formatarMoeda } from "@/shared/utils/valorNumerico";
import {
    buscarCampanhaPorId,
    inativarCampanha,
    listarEdicoesCampanha,
    reativarCampanha,
} from "../services/servicoCampanha";
import { Campanha, EdicaoCampanha } from "../types/campanha.types";
import {
    acoesCampanha,
    formatarCivilBr,
    ROTULO_SITUACAO_SORTEIO,
    rotuloStatusCampanha,
} from "../utils/campanhaEdicao";
import {
    ErroFormCampanha,
    obterErroFormCampanha,
    obterMensagemErroCampanha,
} from "../utils/erroCampanha";

interface ModalCampanhaProps {
    campanha: Campanha;
    onFechar: () => void;
    onAtualizada: (campanha: Campanha) => void;
    onEditar: (campanha: Campanha) => void;
}

type Etapa = "detalhes" | "confirmarInativacao" | "reativar" | "confirmarReativacao";

type FormReativacao = { dataInicio: string; dataFim: string; valorPorTicket: string };

const formReativacaoInicial: FormReativacao = { dataInicio: "", dataFim: "", valorPorTicket: "" };

const classeCampo =
    "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-navy outline-none focus:border-primary";
const classeCampoInvalido =
    "mt-1 w-full rounded-xl border border-red-400 bg-surface px-3 py-2 text-navy outline-none focus:border-red-500";

/** Campanha + sorteio da edição + histórico de edições, num único modal. */
export function ModalCampanha({ campanha, onFechar, onAtualizada, onEditar }: ModalCampanhaProps) {
    const [edicoes, setEdicoes] = useState<EdicaoCampanha[]>([]);
    const [edicaoSelecionada, setEdicaoSelecionada] = useState(campanha.edicao);
    const [sorteioCarregado, setSorteioCarregado] = useState<{ id: number; sorteio: Sorteio | null } | null>(null);
    const [etapa, setEtapa] = useState<Etapa>("detalhes");
    const [form, setForm] = useState<FormReativacao>(formReativacaoInicial);
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState("");
    const [erroCampo, setErroCampo] = useState<ErroFormCampanha | null>(null);
    const erroPeriodo = erroCampo?.campo === "periodo" ? erroCampo.mensagem : null;
    const erroValor = erroCampo?.campo === "valor" ? erroCampo.mensagem : null;

    const acoes = acoesCampanha(campanha);
    const edicao = edicoes.find((item) => item.edicao === edicaoSelecionada);
    const sorteioIdSelecionado = edicao?.sorteioId ?? (edicaoSelecionada === campanha.edicao ? campanha.sorteioId : null);
    const sorteioEmDia = sorteioIdSelecionado !== null && sorteioCarregado?.id === sorteioIdSelecionado;
    const sorteio = sorteioEmDia ? sorteioCarregado.sorteio : null;
    const carregandoSorteio = sorteioIdSelecionado !== null && !sorteioEmDia;

    const recarregarEdicoes = useCallback(async () => {
        setEdicoes(await listarEdicoesCampanha(campanha.id));
    }, [campanha.id]);

    useEffect(() => {
        let cancelado = false;
        listarEdicoesCampanha(campanha.id)
            .then((lista) => {
                if (!cancelado) setEdicoes(lista);
            })
            .catch((error: unknown) => {
                if (!cancelado) setErro(obterMensagemErroCampanha(error, "Erro ao carregar edições."));
            });
        return () => {
            cancelado = true;
        };
    }, [campanha.id]);

    useEffect(() => {
        if (!sorteioIdSelecionado) {
            return;
        }
        let cancelado = false;
        buscarSorteioPorId(sorteioIdSelecionado)
            .then((resultado) => {
                if (!cancelado) setSorteioCarregado({ id: sorteioIdSelecionado, sorteio: resultado });
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setSorteioCarregado({ id: sorteioIdSelecionado, sorteio: null });
                    setErro(obterMensagemErroCampanha(error, "Erro ao carregar o sorteio."));
                }
            });
        return () => {
            cancelado = true;
        };
    }, [sorteioIdSelecionado]);

    async function sincronizarCampanha() {
        const [atualizada] = await Promise.all([buscarCampanhaPorId(campanha.id), recarregarEdicoes()]);
        if (atualizada) onAtualizada(atualizada);
    }

    async function aplicarSorteioAtualizado(atualizado: Sorteio) {
        setSorteioCarregado({ id: atualizado.id, sorteio: atualizado });
        try {
            await sincronizarCampanha();
        } catch (error) {
            setErro(obterMensagemErroCampanha(error, "Erro ao atualizar a campanha."));
        }
    }

    async function confirmarInativacao() {
        setErro("");
        setProcessando(true);
        try {
            onAtualizada(await inativarCampanha(campanha.id));
            await recarregarEdicoes();
            setEtapa("detalhes");
        } catch (error) {
            setErro(obterMensagemErroCampanha(error, "Erro ao inativar a campanha."));
        } finally {
            setProcessando(false);
        }
    }

    function valorReativacao(): number | undefined | null {
        const texto = form.valorPorTicket.trim();
        if (!texto) return undefined;
        const valor = Number(texto.replace(",", "."));
        return Number.isFinite(valor) && valor > 0 ? valor : null;
    }

    function revisarReativacao(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setErroCampo(null);
        const erroData =
            validarDataNaoPassada(form.dataInicio, { rotulo: "início", obrigatorio: true }) ??
            validarDataNaoPassada(form.dataFim, { rotulo: "fim", obrigatorio: true });
        if (erroData) {
            setErroCampo({ campo: "periodo", mensagem: erroData });
            return;
        }
        if (form.dataFim < form.dataInicio) {
            setErroCampo({ campo: "periodo", mensagem: "A data de fim deve ser maior ou igual à data de início." });
            return;
        }
        if (valorReativacao() === null) {
            setErroCampo({ campo: "valor", mensagem: "Valor por ticket deve ser maior que zero." });
            return;
        }
        setEtapa("confirmarReativacao");
    }

    async function confirmarReativacao() {
        setErro("");
        setErroCampo(null);
        setProcessando(true);
        try {
            const valorPorTicket = valorReativacao() ?? undefined;
            const reativada = await reativarCampanha(campanha.id, {
                dataInicio: form.dataInicio,
                dataFim: form.dataFim,
                ...(valorPorTicket !== undefined ? { valorPorTicket } : {}),
            });
            onAtualizada(reativada);
            await recarregarEdicoes();
            setEdicaoSelecionada(reativada.edicao);
            setForm(formReativacaoInicial);
            setEtapa("detalhes");
        } catch (error) {
            const falha = obterErroFormCampanha(error, "Erro ao reativar a campanha.");
            if (falha.campo) {
                setErroCampo(falha);
            } else {
                setErro(falha.mensagem);
            }
            setEtapa("reativar");
        } finally {
            setProcessando(false);
        }
    }

    const valorConfirmado = valorReativacao() ?? campanha.valorPorTicket;

    return (
        <ModalOverlay onFechar={onFechar} bloqueado={processando} largura="xl">
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <p className="painel-eyebrow">Campanha · edição {campanha.edicao}</p>
                    <h2 className="text-xl font-semibold text-navy">{campanha.nome}</h2>
                    <p className="mt-1 text-sm text-muted">
                        {rotuloStatusCampanha(campanha)} · {formatarCivilBr(campanha.dataInicioCivil)} —{" "}
                        {formatarCivilBr(campanha.dataFimCivil)} · {formatarMoeda(campanha.valorPorTicket)} por ticket
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onFechar}
                    disabled={processando}
                    className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy disabled:opacity-50"
                    aria-label="Fechar modal"
                >
                    ×
                </button>
            </div>

            {erro ? (
                <div
                    role="alert"
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {erro}
                </div>
            ) : null}

            {etapa === "confirmarInativacao" ? (
                <div className="painel-card space-y-3 px-5 py-4">
                    <h3 className="font-semibold text-navy">Inativar campanha</h3>
                    <p className="text-sm text-muted">
                        A campanha deixa de aceitar notas fiscais e some do aplicativo. Tickets,
                        sorteios e histórico são preservados; depois você pode reativá-la em uma
                        nova edição.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEtapa("detalhes")} disabled={processando} className="btn-secundario text-sm">
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={() => void confirmarInativacao()}
                            disabled={processando}
                            className="btn-perigo text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processando ? "Inativando..." : "Inativar"}
                        </button>
                    </div>
                </div>
            ) : null}

            {etapa === "reativar" ? (
                <form onSubmit={revisarReativacao} className="painel-card space-y-4 px-5 py-4" noValidate>
                    <div>
                        <h3 className="font-semibold text-navy">Reativar em nova edição</h3>
                        <p className="text-sm text-muted">
                            A edição {campanha.edicao + 1} começa com tickets numerados a partir do 1 e
                            ganha um sorteio próprio.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <CampoData
                            rotulo="Novo início"
                            valor={form.dataInicio}
                            onChange={(dataInicio) => setForm((atual) => ({ ...atual, dataInicio }))}
                            className={erroPeriodo ? classeCampoInvalido : classeCampo}
                            obrigatorio
                        />
                        <CampoData
                            rotulo="Novo fim"
                            valor={form.dataFim}
                            onChange={(dataFim) => setForm((atual) => ({ ...atual, dataFim }))}
                            minimo={form.dataInicio}
                            className={erroPeriodo ? classeCampoInvalido : classeCampo}
                            obrigatorio
                        />
                    </div>
                    {erroPeriodo ? (
                        <p role="alert" className="-mt-2 text-xs font-medium text-red-600">{erroPeriodo}</p>
                    ) : null}
                    <label className="block text-sm font-medium text-navy">
                        Valor por ticket (R$, opcional)
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.valorPorTicket}
                            placeholder={String(campanha.valorPorTicket)}
                            onChange={(event) => setForm((atual) => ({ ...atual, valorPorTicket: event.target.value }))}
                            className={erroValor ? classeCampoInvalido : classeCampo}
                            aria-invalid={Boolean(erroValor)}
                        />
                        {erroValor ? (
                            <span role="alert" className="mt-1 block text-xs font-medium text-red-600">{erroValor}</span>
                        ) : null}
                        <span className="mt-1 block text-xs font-normal text-muted">
                            Em branco mantém {formatarMoeda(campanha.valorPorTicket)}.
                        </span>
                    </label>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEtapa("detalhes")} className="btn-secundario text-sm">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primario text-sm">
                            Continuar
                        </button>
                    </div>
                </form>
            ) : null}

            {etapa === "confirmarReativacao" ? (
                <div className="painel-card space-y-3 px-5 py-4">
                    <h3 className="font-semibold text-navy">Confirmar reativação</h3>
                    <p className="text-sm text-muted">
                        Abrir a edição {campanha.edicao + 1} de {formatarCivilBr(form.dataInicio)} a{" "}
                        {formatarCivilBr(form.dataFim)}, com {formatarMoeda(valorConfirmado)} por ticket?
                        A edição {campanha.edicao} continua no histórico.
                    </p>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEtapa("reativar")} disabled={processando} className="btn-secundario text-sm">
                            Voltar
                        </button>
                        <button
                            type="button"
                            onClick={() => void confirmarReativacao()}
                            disabled={processando}
                            className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processando ? "Reativando..." : "Confirmar reativação"}
                        </button>
                    </div>
                </div>
            ) : null}

            {etapa === "detalhes" ? (
                <div className="space-y-5">
                    <div className="flex flex-wrap justify-end gap-2">
                        <button type="button" onClick={() => onEditar(campanha)} className="btn-secundario text-sm">
                            Editar
                        </button>
                        {acoes.podeInativar ? (
                            <button type="button" onClick={() => setEtapa("confirmarInativacao")} className="btn-perigo text-sm">
                                Inativar
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setErro("");
                                    setErroCampo(null);
                                    setEtapa("reativar");
                                }}
                                disabled={!acoes.podeReativar}
                                title={acoes.motivoReativar ?? undefined}
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Reativar
                            </button>
                        )}
                    </div>
                    {!campanha.ativa && acoes.motivoReativar ? (
                        <p className="text-right text-xs text-muted">{acoes.motivoReativar}</p>
                    ) : null}

                    {edicoes.length > 1 ? (
                        <div>
                            <h3 className="mb-2 text-sm font-semibold text-navy">Edições</h3>
                            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Edições da campanha">
                                {edicoes.map((item) => (
                                    <button
                                        key={item.edicao}
                                        type="button"
                                        role="tab"
                                        aria-selected={item.edicao === edicaoSelecionada}
                                        onClick={() => setEdicaoSelecionada(item.edicao)}
                                        className={`rounded-full border px-3 py-1.5 text-sm ${
                                            item.edicao === edicaoSelecionada
                                                ? "border-primary bg-primary text-white"
                                                : "border-border text-navy hover:border-primary"
                                        }`}
                                    >
                                        Edição {item.edicao}
                                        {item.atual ? " (atual)" : ""}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {edicao ? (
                        <dl className="grid gap-3 text-sm sm:grid-cols-4">
                            <div className="painel-card px-4 py-3">
                                <dt className="text-muted">Tickets</dt>
                                <dd className="text-2xl font-bold text-navy">{edicao.totalTickets}</dd>
                            </div>
                            <div className="painel-card px-4 py-3 sm:col-span-2">
                                <dt className="text-muted">Período da edição {edicao.edicao}</dt>
                                <dd className="font-semibold text-navy">
                                    {formatarCivilBr(edicao.dataInicioCivil)} — {formatarCivilBr(edicao.dataFimCivil)}
                                </dd>
                                <dd className="text-xs text-muted">{formatarMoeda(edicao.valorPorTicket)} por ticket</dd>
                            </div>
                            <div className="painel-card px-4 py-3">
                                <dt className="text-muted">Sorteio</dt>
                                <dd className="font-semibold text-navy">{ROTULO_SITUACAO_SORTEIO[edicao.situacaoSorteio]}</dd>
                            </div>
                        </dl>
                    ) : null}

                    <div>
                        <h3 className="mb-2 text-sm font-semibold text-navy">Sorteio da edição {edicaoSelecionada}</h3>
                        {carregandoSorteio ? (
                            <p className="text-sm text-muted">Carregando sorteio...</p>
                        ) : sorteio ? (
                            <ConteudoResultadoSorteio
                                key={sorteio.id}
                                sorteio={sorteio}
                                onAtualizado={(atualizado) => void aplicarSorteioAtualizado(atualizado)}
                                onProcessandoChange={setProcessando}
                            />
                        ) : (
                            <p className="text-sm text-muted">Sorteio indisponível para esta edição.</p>
                        )}
                    </div>
                </div>
            ) : null}
        </ModalOverlay>
    );
}
