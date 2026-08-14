"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarEvento,
    criarEvento,
    deletarEvento,
    enviarImagemEvento,
    listarEventos,
} from "../services/servicoEvento";
import { Evento } from "../types/evento.types";
import { TabelaEventos } from "./TabelaEventos";
import { SeletorImagem } from "@/shared/components/midia/SeletorImagem";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";

type FormState = {
    nome: string;
    descricao: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
};

export function CrudEventos() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
    const [eventoExcluindo, setEventoExcluindo] = useState<Evento | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
    const [previewLocal, setPreviewLocal] = useState<string | null>(null);

    const tituloModal = useMemo(
        () => (eventoEditando ? "Editar evento" : "Novo evento"),
        [eventoEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarEventos()
            .then((lista) => {
                if (!cancelado) {
                    setEventos(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar eventos."));
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
        setEventoEditando(null);
        setForm(formInicial);
        setArquivoImagem(null);
        setPreviewLocal(null);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(evento: Evento) {
        setEventoEditando(evento);
        setForm({
            nome: evento.nome,
            descricao: evento.descricao ?? "",
        });
        setArquivoImagem(null);
        setPreviewLocal(null);
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setEventoEditando(null);
        setForm(formInicial);
        setArquivoImagem(null);
        setPreviewLocal(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const dados = {
                nome: form.nome.trim(),
                descricao: form.descricao.trim() || null,
            };

            if (eventoEditando) {
                let atualizado = await atualizarEvento(eventoEditando.id, dados);
                if (arquivoImagem) {
                    atualizado = await enviarImagemEvento(
                        eventoEditando.id,
                        arquivoImagem,
                    );
                }
                setEventos((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                let criado = await criarEvento(dados);
                if (arquivoImagem) {
                    criado = await enviarImagemEvento(criado.id, arquivoImagem);
                }
                setEventos((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar evento."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!eventoExcluindo) {
            return;
        }

        setExcluindoId(eventoExcluindo.id);
        setErro("");

        try {
            await deletarEvento(eventoExcluindo.id);
            setEventos((lista) =>
                lista.filter((item) => item.id !== eventoExcluindo.id),
            );
            setEventoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir evento."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Eventos</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Gerencie cadastro, edição e exclusão de eventos.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Novo evento
                </button>
            </div>

            {erro && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            )}

            <div className="overflow-x-auto">
                <TabelaEventos
                    eventos={eventos}
                    onEditar={abrirEdicao}
                    onExcluir={setEventoExcluindo}
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
                                    {eventoEditando
                                        ? "Altere os dados do evento."
                                        : "Informe os dados para cadastrar um evento."}
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

                            <SeletorImagem
                                id="foto-evento"
                                rotulo="Imagem (opcional)"
                                previewUrl={
                                    previewLocal ??
                                    urlPublicaArquivo(eventoEditando?.urlImagem)
                                }
                                onSelecionar={(arquivo) => {
                                    setArquivoImagem(arquivo);
                                    setPreviewLocal(
                                        arquivo ? URL.createObjectURL(arquivo) : null,
                                    );
                                }}
                                desabilitado={salvando}
                            />

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

            {eventoExcluindo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
                    <div className="w-full max-w-md bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Excluir evento
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Confirma a exclusão de {eventoExcluindo.nome}? Essa ação
                            não poderá ser desfeita.
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setEventoExcluindo(null)}
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
