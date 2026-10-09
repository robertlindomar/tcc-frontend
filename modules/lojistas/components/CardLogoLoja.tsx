"use client";

import { useRef, useState } from "react";
import { Check, CloudUpload, ImageIcon, Info, LoaderCircle, Store } from "lucide-react";
import { enviarLogoLojista } from "../services/servicoLojista";
import { Lojista } from "../types/lojista.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";
import estilos from "./minha-loja.module.css";

export function CardLogoLoja({ loja, onAtualizar }: { loja: Lojista; onAtualizar: (loja: Lojista) => void }) {
    const campo = useRef<HTMLInputElement>(null);
    const [enviando, setEnviando] = useState(false);
    const [arrastando, setArrastando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const url = urlPublicaArquivo(loja.urlLogo);

    async function enviar(arquivo?: File) {
        if (!arquivo || enviando) return;
        setErro(null);
        setAviso(null);
        if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
            setErro("Selecione uma imagem JPG, PNG ou WebP.");
            return;
        }
        if (arquivo.size > 2 * 1024 * 1024) {
            setErro("A imagem deve ter no máximo 2 MB.");
            return;
        }
        setEnviando(true);
        try {
            onAtualizar(await enviarLogoLojista(loja.id, arquivo));
            setAviso("Logo atualizada. Ela aparece na lista de lojas do aplicativo.");
        } catch (causa) {
            setErro(obterMensagemErroApi(causa, "Não foi possível enviar a logo."));
        } finally {
            if (campo.current) campo.current.value = "";
            setEnviando(false);
        }
    }

    return (
        <section className={`${estilos.card} ${estilos.logoCard}`} aria-labelledby="logo-loja-titulo">
            <div className={`${estilos.cabecalhoCard} ${estilos.logoTitulo}`}>
                <span className={`${estilos.iconeCabecalho} ${estilos.rosa}`}><ImageIcon size={27} aria-hidden /></span>
                <div className={estilos.textoCabecalho}>
                    <h2 id="logo-loja-titulo">Logo da loja</h2>
                    <p>A imagem será exibida junto ao nome do seu comércio no aplicativo.</p>
                </div>
            </div>
            <input ref={campo} className="sr-only" type="file" aria-label="Arquivo da logo da loja" accept="image/jpeg,image/png,image/webp" disabled={enviando} onChange={(evento) => { const arquivo = evento.currentTarget.files?.[0]; evento.currentTarget.value = ""; void enviar(arquivo); }} />
            <button
                type="button" disabled={enviando}
                className={`${estilos.zonaUpload} ${arrastando ? estilos.arrastando : ""}`}
                onClick={() => campo.current?.click()}
                onDragOver={(evento) => { evento.preventDefault(); if (!enviando) setArrastando(true); }}
                onDragLeave={() => setArrastando(false)}
                onDrop={(evento) => { evento.preventDefault(); setArrastando(false); void enviar(evento.dataTransfer.files[0]); }}
            >
                {enviando ? <LoaderCircle size={42} className="animate-spin" aria-hidden /> : <CloudUpload size={42} aria-hidden />}
                <strong>{enviando ? "Enviando logo…" : "Enviar ou trocar logo"}</strong>
                <span>Clique para selecionar um arquivo<br />ou arraste aqui</span>
            </button>
            <div className={estilos.dicasLogo}>
                <strong><Info size={18} aria-hidden />Dicas para uma boa logo</strong>
                <ul>
                    {["Use uma imagem quadrada", "Prefira fundo transparente ou claro", "Formato: JPG, PNG ou WebP", "Tamanho máximo: 2 MB"].map(dica => <li key={dica}><Check size={18} aria-hidden />{dica}</li>)}
                </ul>
            </div>
            <div className={estilos.previewLogo}>
                <strong>Pré-visualização</strong>
                <div className={estilos.previewQuadro}>
                    {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt={`Logo de ${loja.nomeFantasia}`} src={url} />
                    ) : <div className={estilos.previewVazio}><Store size={38} aria-hidden /><span>Sua logo aqui</span></div>}
                </div>
            </div>
            {erro ? <p role="alert" className={`${estilos.textoErro} ${estilos.mensagemLogo}`}>{erro}</p> : null}
            {aviso ? <p role="status" className={`${estilos.textoSucesso} ${estilos.mensagemLogo}`}>{aviso}</p> : null}
        </section>
    );
}
