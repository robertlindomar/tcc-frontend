"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarCategoria,
    criarCategoria,
    deletarCategoria,
    listarCategorias,
} from "../services/servicoCategoria";
import { Categoria } from "../types/categoria.types";
import { TabelaCategorias } from "./TabelaCategorias";

export function CrudCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);
    const [categoriaExcluindo, setCategoriaExcluindo] = useState<Categoria | null>(null);
    const [nome, setNome] = useState("");

    const tituloModal = useMemo(
        () => (categoriaEditando ? "Editar categoria" : "Nova categoria"),
        [categoriaEditando],
    );

    useEffect(() => {
        let cancelado = false;

        listarCategorias()
            .then((lista) => {
                if (!cancelado) {
                    setCategorias(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar categorias."));
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
        setCategoriaEditando(null);
        setNome("");
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(categoria: Categoria) {
        setCategoriaEditando(categoria);
        setNome(categoria.nome);
        setErro("");
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }
        setModalAberto(false);
        setCategoriaEditando(null);
        setNome("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");
        setSalvando(true);

        try {
            const dados = { nome: nome.trim() };

            if (categoriaEditando) {
                const atualizado = await atualizarCategoria(categoriaEditando.id, dados);
                setCategorias((lista) =>
                    lista.map((item) => (item.id === atualizado.id ? atualizado : item)),
                );
            } else {
                const criado = await criarCategoria(dados);
                setCategorias((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar categoria."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!categoriaExcluindo) {
            return;
        }

        setExcluindoId(categoriaExcluindo.id);
        setErro("");

        try {
            await deletarCategoria(categoriaExcluindo.id);
            setCategorias((lista) =>
                lista.filter((item) => item.id !== categoriaExcluindo.id),
            );
            setCategoriaExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir categoria."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">LOJISTA</p>
                    <h1 className="painel-titulo">Categorias</h1>
                    <p className="painel-subtitulo">
                        Categorias da sua loja, usadas ao cadastrar produtos.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={abrirCriacao}
                    className="btn-primario"
                >
                    Nova categoria
                </button>
            </div>

            {erro ? (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            ) : null}

            <TabelaCategorias
                categorias={categorias}
                onEditar={abrirEdicao}
                onExcluir={setCategoriaExcluindo}
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
                                {categoriaEditando
                                    ? "Altere o nome da categoria."
                                    : "Informe o nome da nova categoria."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fecharModal}
                            disabled={salvando}
                            className="px-2 py-1 text-2xl leading-none text-slate-500 hover:text-slate-900 disabled:opacity-50"
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
                                value={nome}
                                onChange={(event) => setNome(event.target.value)}
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary"
                                required
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

            {categoriaExcluindo ? (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            setCategoriaExcluindo(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">
                        Excluir categoria
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                        Confirma a exclusão de {categoriaExcluindo.nome}? Produtos
                        ligados a ela ficam sem categoria.
                    </p>
                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setCategoriaExcluindo(null)}
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
                            {excluindoId !== null ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                </ModalOverlay>
            ) : null}
        </section>
    );
}
