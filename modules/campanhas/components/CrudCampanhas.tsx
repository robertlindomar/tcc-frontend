"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
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
    dataInicio: string;
    dataFim: string;
    valorPorTicket: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    qrcode: "",
    dataInicio: "",
    dataFim: "",
    valorPorTicket: "10",
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
            dataInicio: campanha.dataInicioCivil,
            dataFim: campanha.dataFimCivil,
            valorPorTicket: String(campanha.valorPorTicket),
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
        if (!form.dataInicio || !form.dataFim) {
            setErro("Informe início e fim da campanha.");
            return;
        }
        if (form.dataFim < form.dataInicio) {
            setErro("A data de fim deve ser maior ou igual à data de início.");
            return;
        }
        const valorPorTicket = Number(form.valorPorTicket.replace(",", "."));
        if (!Number.isFinite(valorPorTicket) || valorPorTicket <= 0) {
            setErro("Valor por ticket deve ser maior que zero.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome,
                descricao: form.descricao.trim() || null,
                qrcode: form.qrcode.trim() || null,
                dataInicio: form.dataInicio,
                dataFim: form.dataFim,
                valorPorTicket,
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

    const classeCampo =
        "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-navy outline-none focus:border-primary";

    return (
        <div className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">Associação</p>
                    <h1 className="painel-titulo">Campanhas</h1>
                    <p className="painel-subtitulo">
                        Defina período e quanto cada ticket custa em reais. Todas as lojas
                        aprovadas participam automaticamente.
                    </p>
                </div>

                <button type="button" onClick={abrirCriacao} className="btn-primario text-sm">
                    Nova campanha
                </button>
            </div>

            {erro ? (
                <div className="painel-card border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <TabelaCampanhas
                campanhas={campanhas}
                onEditar={abrirEdicao}
                onExcluir={setCampanhaExcluindo}
                carregando={carregando}
                excluindoId={excluindoId}
            />

            {modalAberto ? (
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">
                                {tituloModal}
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                {campanhaEditando
                                    ? "Altere os dados da campanha."
                                    : "Informe vigência e valor por ticket."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fecharModal}
                            disabled={salvando}
                            className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy disabled:opacity-50"
                            aria-label="Fechar modal"
                        >
                            ×
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
                                className={classeCampo}
                                required
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium text-navy">
                                Início
                                <input
                                    type="date"
                                    value={form.dataInicio}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            dataInicio: event.target.value,
                                        }))
                                    }
                                    className={classeCampo}
                                    required
                                />
                            </label>
                            <label className="block text-sm font-medium text-navy">
                                Fim
                                <input
                                    type="date"
                                    value={form.dataFim}
                                    onChange={(event) =>
                                        setForm((atual) => ({
                                            ...atual,
                                            dataFim: event.target.value,
                                        }))
                                    }
                                    className={classeCampo}
                                    required
                                />
                            </label>
                        </div>

                        <label className="block text-sm font-medium text-navy">
                            Valor por ticket (R$)
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.valorPorTicket}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        valorPorTicket: event.target.value,
                                    }))
                                }
                                className={classeCampo}
                                required
                            />
                            <span className="mt-1 block text-xs font-normal text-muted">
                                Ex.: 10 = a cada R$ 10 em notas válidas, 1 ticket.
                            </span>
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
                                className={classeCampo}
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
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

            {campanhaExcluindo ? (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            setCampanhaExcluindo(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">
                        Excluir campanha
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Confirma a exclusão de {campanhaExcluindo.nome}? Essa ação
                        não poderá ser desfeita.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setCampanhaExcluindo(null)}
                            disabled={excluindoId !== null}
                            className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={confirmarExclusao}
                            disabled={excluindoId !== null}
                            className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {excluindoId ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </ModalOverlay>
            ) : null}
        </div>
    );
}
