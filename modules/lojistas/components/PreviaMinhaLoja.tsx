"use client";

import { useEffect, useState } from "react";
import { Store, X } from "lucide-react";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { listarProdutos } from "@/modules/produtos/services/servicoProduto";
import { Produto } from "@/modules/produtos/types/produto.types";
import { Lojista } from "../types/lojista.types";

export function PreviaMinhaLoja({ loja, onFechar }: { loja: Lojista; onFechar: () => void }) {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const logo = urlPublicaArquivo(loja.urlLogo);
    useEffect(() => {
        let cancelado = false;
        async function carregar() {
            try { const lista = await listarProdutos(); if (!cancelado) setProdutos(lista); }
            catch (causa) { if (!cancelado) setErro(obterMensagemErroApi(causa, "Não foi possível carregar os produtos.")); }
            finally { if (!cancelado) setCarregando(false); }
        }
        void carregar();
        return () => { cancelado = true; };
    }, []);
    return <ModalOverlay onFechar={onFechar} largura="lg">
        <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Prévia para o cliente</p><h2 className="mt-1 text-xl font-bold text-navy">Sua loja no aplicativo</h2></div>
            <button type="button" aria-label="Fechar prévia" onClick={onFechar} className="rounded-lg p-2 text-muted hover:bg-primary-muted"><X size={20} /></button>
        </div>
        <div className="mt-5 flex items-center gap-4 rounded-2xl bg-primary-muted/50 p-5">
            {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt={`Logo de ${loja.nomeFantasia}`} className="h-16 w-16 rounded-xl bg-white object-contain" />
            ) : <Store size={34} className="text-primary" aria-hidden />}
            <h3 className="text-xl font-bold text-navy">{loja.nomeFantasia}</h3>
        </div>
        <h3 className="mt-6 font-semibold text-navy">Produtos</h3>
        {carregando ? <p className="mt-3 text-sm text-muted">Carregando produtos…</p> : erro ? <p role="alert" className="mt-3 text-sm text-red-700">{erro}</p> : produtos.length === 0 ? <p className="mt-3 text-sm text-muted">Ainda não há produtos cadastrados.</p> : (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{produtos.map(produto => {
                const imagem = urlPublicaArquivo(produto.urlImagem);
                return <article key={produto.id} className="overflow-hidden rounded-xl border border-border bg-white">
                    {imagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagem} alt={produto.nome} className="h-28 w-full object-cover" />
                    ) : null}
                    <div className="p-3"><p className="text-sm font-semibold text-navy">{produto.nome}</p><p className="mt-1 text-sm font-bold text-primary">{produto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p></div>
                </article>;
            })}</div>
        )}
        <p className="mt-5 text-xs text-muted">Prévia com os dados atuais da loja. A experiência completa do consumidor está no aplicativo.</p>
    </ModalOverlay>;
}
