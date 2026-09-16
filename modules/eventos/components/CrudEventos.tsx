"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
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
        <section className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">LOJISTA</p>
                    <h1 className="painel-titulo">Eventos</h1>
                    <p className="painel-subtitulo">
                        Gerencie cadastro, edição e exclusão de eventos.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="btn-primario"
                >
                    Novo evento
                </button>
            </div>

            {erro && (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
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
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">
                                {tituloModal}
                            </h2>
                            <p className="mt-1 text-sm text-muted">
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

            {eventoExcluindo && (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            setEventoExcluindo(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">
                        Excluir evento
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Confirma a exclusão de {eventoExcluindo.nome}? Essa ação
                        não poderá ser desfeita.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEventoExcluindo(null)}
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
