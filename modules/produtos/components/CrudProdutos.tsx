"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { listarCategorias } from "@/modules/categorias/services/servicoCategoria";
import { Categoria } from "@/modules/categorias/types/categoria.types";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarProduto,
    criarProduto,
    deletarProduto,
    enviarImagemProduto,
    listarProdutos,
} from "../services/servicoProduto";
import { Produto } from "../types/produto.types";
import { TabelaProdutos } from "./TabelaProdutos";
import { SeletorImagem } from "@/shared/components/midia/SeletorImagem";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";

type FormState = {
    nome: string;
    valor: string;
    categoriaId: string;
};

const formInicial: FormState = {
    nome: "",
    valor: "",
    categoriaId: "",
};

function parseValor(valor: string): number | undefined {
    const trim = valor.trim().replace(",", ".");
    if (!trim) {
        return undefined;
    }
    const numero = Number(trim);
    return Number.isFinite(numero) ? numero : undefined;
}

function parseCategoriaId(valor: string): number | null | undefined {
    const trim = valor.trim();
    if (!trim) {
        return null;
    }
    const numero = Number(trim);
    return Number.isInteger(numero) && numero > 0 ? numero : undefined;
}

export function CrudProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
    const [produtoExcluindo, setProdutoExcluindo] = useState<Produto | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);
    const [arquivoImagem, setArquivoImagem] = useState<File | null>(null);
    const [previewLocal, setPreviewLocal] = useState<string | null>(null);

    const tituloModal = useMemo(
        () => (produtoEditando ? "Editar produto" : "Novo produto"),
        [produtoEditando],
    );

    const nomeCategoriaPorId = useMemo(() => {
        const mapa = new Map<number, string>();
        for (const item of categorias) {
            mapa.set(item.id, item.nome);
        }
        return mapa;
    }, [categorias]);

    useEffect(() => {
        let cancelado = false;

        Promise.all([listarProdutos(), listarCategorias()])
            .then(([listaProdutos, listaCategorias]) => {
                if (!cancelado) {
                    setProdutos(listaProdutos);
                    setCategorias(listaCategorias);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar produtos."));
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
        setProdutoEditando(null);
        setForm(formInicial);
        setArquivoImagem(null);
        setPreviewLocal(null);
        setErro("");
        setModalAberto(true);
    }

    function abrirEdicao(produto: Produto) {
        setProdutoEditando(produto);
        setForm({
            nome: produto.nome,
            valor: String(produto.valor),
            categoriaId:
                produto.categoriaId != null ? String(produto.categoriaId) : "",
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
        setProdutoEditando(null);
        setForm(formInicial);
        setArquivoImagem(null);
        setPreviewLocal(null);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErro("");

        const valor = parseValor(form.valor);
        if (valor === undefined) {
            setErro("Valor inválido.");
            return;
        }

        const categoriaId = parseCategoriaId(form.categoriaId);
        if (categoriaId === undefined) {
            setErro("Categoria inválida.");
            return;
        }

        const legadoSemFoto = Boolean(produtoEditando && !produtoEditando.urlImagem);
        if (!produtoEditando && !arquivoImagem) {
            setErro("Selecione uma imagem do produto.");
            return;
        }
        if (legadoSemFoto && !arquivoImagem) {
            setErro("Este produto ainda não tem foto. Adicione uma imagem para salvar.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome: form.nome.trim(),
                valor,
                categoriaId,
            };

            if (produtoEditando) {
                let atualizado = produtoEditando;
                if (arquivoImagem && !produtoEditando.urlImagem) {
                    atualizado = await enviarImagemProduto(
                        produtoEditando.id,
                        arquivoImagem,
                    );
                    atualizado = await atualizarProduto(produtoEditando.id, dados);
                } else {
                    atualizado = await atualizarProduto(produtoEditando.id, dados);
                    if (arquivoImagem) {
                        atualizado = await enviarImagemProduto(
                            produtoEditando.id,
                            arquivoImagem,
                        );
                    }
                }
                setProdutos((lista) =>
                    lista.map((item) =>
                        item.id === atualizado.id ? atualizado : item,
                    ),
                );
            } else {
                if (!arquivoImagem) {
                    setErro("Selecione uma imagem do produto.");
                    return;
                }
                const criado = await criarProduto(dados, arquivoImagem);
                setProdutos((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar produto."));
        } finally {
            setSalvando(false);
        }
    }

    async function confirmarExclusao() {
        if (!produtoExcluindo) {
            return;
        }

        setExcluindoId(produtoExcluindo.id);
        setErro("");

        try {
            await deletarProduto(produtoExcluindo.id);
            setProdutos((lista) =>
                lista.filter((item) => item.id !== produtoExcluindo.id),
            );
            setProdutoExcluindo(null);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao excluir produto."));
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <section className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">LOJISTA</p>
                    <h1 className="painel-titulo">Produtos</h1>
                    <p className="painel-subtitulo">
                        Gerencie cadastro, edição e exclusão de produtos.
                    </p>
                </div>

                <button type="button" onClick={abrirCriacao} className="btn-primario">
                    Novo produto
                </button>
            </div>

            {erro && !modalAberto && !produtoExcluindo ? (
                <div className="rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                    {erro}
                </div>
            ) : null}

            <div className="overflow-x-auto">
                <TabelaProdutos
                    produtos={produtos}
                    nomeCategoriaPorId={nomeCategoriaPorId}
                    onEditar={abrirEdicao}
                    onExcluir={setProdutoExcluindo}
                    carregando={carregando}
                    excluindoId={excluindoId}
                />
            </div>

            {modalAberto ? (
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">{tituloModal}</h2>
                            <p className="mt-1 text-sm text-muted">
                                {produtoEditando
                                    ? produtoEditando.urlImagem
                                        ? "Altere os dados. A foto pode ser trocada, mas o produto não fica sem imagem."
                                        : "Este produto ainda não tem foto. Adicione uma imagem para concluir a edição."
                                    : "Informe os dados e uma foto para cadastrar o produto."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fecharModal}
                            disabled={salvando}
                            className="rounded-lg p-1.5 text-muted transition hover:bg-primary-muted hover:text-navy disabled:opacity-50"
                            aria-label="Fechar modal"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {erro ? (
                        <div className="mb-4 rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-4 py-3 text-sm text-[#b91c1c]">
                            {erro}
                        </div>
                    ) : null}

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
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2.5 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Valor
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.valor}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        valor: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2.5 text-navy outline-none focus:border-primary"
                                required
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Categoria (opcional)
                            <select
                                value={form.categoriaId}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        categoriaId: event.target.value,
                                    }))
                                }
                                className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2.5 text-navy outline-none focus:border-primary"
                            >
                                <option value="">Sem categoria</option>
                                {categorias.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.nome}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <SeletorImagem
                            id="foto-produto"
                            rotulo={produtoEditando?.urlImagem ? "Foto (trocar)" : "Foto"}
                            previewUrl={
                                previewLocal ?? urlPublicaArquivo(produtoEditando?.urlImagem)
                            }
                            onSelecionar={(arquivo) => {
                                setArquivoImagem(arquivo);
                                setPreviewLocal(
                                    arquivo ? URL.createObjectURL(arquivo) : null,
                                );
                            }}
                            desabilitado={salvando}
                            obrigatorio={!produtoEditando || !produtoEditando.urlImagem}
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
                                disabled={
                                    salvando ||
                                    (!produtoEditando && !arquivoImagem) ||
                                    Boolean(
                                        produtoEditando &&
                                            !produtoEditando.urlImagem &&
                                            !arquivoImagem,
                                    )
                                }
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            ) : null}

            {produtoExcluindo ? (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            setProdutoExcluindo(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">Excluir produto</h2>
                    <p className="mt-2 text-sm text-muted">
                        Confirma a exclusão de {produtoExcluindo.nome}? Essa ação não
                        poderá ser desfeita.
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setProdutoExcluindo(null)}
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
            ) : null}
        </section>
    );
}
