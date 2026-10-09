"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { atualizarEndereco, buscarEnderecoDoUsuario, criarEndereco } from "../services/servicoEndereco";
import { Endereco } from "../types/endereco.types";
import { obterLocalizacaoLoja } from "../services/localizacaoLoja";
import estilos from "@/modules/lojistas/components/minha-loja.module.css";

type Props = { usuarioId: number; enderecoVinculadoId: number | null; onEnderecoCriado: (id: number) => Promise<void> };
type Formulario = { cep: string; numero: string; latitude: string; longitude: string };
type Geografia = { rua: string; bairro: string; cidade: string; uf: string };
const geografiaVazia: Geografia = { rua: "", bairro: "", cidade: "", uf: "" };
const digitos = (valor: string) => valor.replace(/\D/g, "");
const formatarCep = (valor: string) => digitos(valor).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");

export function CardEnderecoLoja({ usuarioId, enderecoVinculadoId, onEnderecoCriado }: Props) {
    const [endereco, setEndereco] = useState<Endereco | null>(null);
    const [form, setForm] = useState<Formulario>({ cep: "", numero: "", latitude: "", longitude: "" });
    const [geografia, setGeografia] = useState<Geografia>(geografiaVazia);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [consultando, setConsultando] = useState(false);
    const [localizando, setLocalizando] = useState(false);
    const [mostrarCoordenadas, setMostrarCoordenadas] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const consulta = useRef<AbortController | null>(null);
    const cepAtual = useRef("");
    function preencher(atual: Endereco) {
        setForm({ cep: formatarCep(atual.cep), numero: atual.numero ?? "", latitude: atual.latitude != null ? String(atual.latitude) : "", longitude: atual.longitude != null ? String(atual.longitude) : "" });
        cepAtual.current = digitos(atual.cep);
        setGeografia({ rua: atual.rua.nome, bairro: atual.bairro.nome, cidade: atual.cidade.nome, uf: atual.estado.uf });
    }
    useEffect(() => {
        let cancelado = false;
        async function carregar() {
            try {
                const atual = await buscarEnderecoDoUsuario(usuarioId);
                if (!cancelado) { setEndereco(atual); if (atual) preencher(atual); }
            } catch (causa) { if (!cancelado) setErro(obterMensagemErroApi(causa, "Erro ao carregar o endereço da loja.")); }
            finally { if (!cancelado) setCarregando(false); }
        }
        void carregar();
        return () => { cancelado = true; consulta.current?.abort(); };
    }, [usuarioId]);

    async function consultarCep() {
        const cep = digitos(form.cep);
        if (cep.length !== 8) { setErro("Informe um CEP com 8 dígitos."); return; }
        consulta.current?.abort();
        const controle = new AbortController();
        consulta.current = controle;
        setConsultando(true); setErro(""); setAviso("");
        try {
            // Prévia somente de leitura. Ao salvar, a API resolve o CEP novamente como fonte de verdade.
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal: controle.signal });
            if (!resposta.ok) throw new Error("Não foi possível consultar o CEP.");
            const dados = await resposta.json();
            if (dados.erro) throw new Error("CEP não encontrado.");
            if (cepAtual.current === cep) setGeografia({ rua: dados.logradouro || "", bairro: dados.bairro || "", cidade: dados.localidade || "", uf: dados.uf || "" });
        } catch (causa) {
            if (!controle.signal.aborted && cepAtual.current === cep) setErro(obterMensagemErroApi(causa, "Não foi possível consultar o CEP. Você pode tentar novamente ou salvar pela API."));
        } finally { if (consulta.current === controle) setConsultando(false); }
    }

    async function usarLocalizacao() {
        setErro(""); setAviso("");
        setLocalizando(true);
        try {
            const posicao = await obterLocalizacaoLoja({ contextoSeguro: window.isSecureContext, geolocalizacao: navigator.geolocation });
            setForm(atual => ({ ...atual, latitude: String(posicao.latitude), longitude: String(posicao.longitude) }));
            setAviso("Localização obtida: coordenadas preenchidas abaixo. O CEP e o número continuam sendo informados no formulário. Salve o endereço para aplicar à loja.");
        } catch (causa) {
            setErro(obterMensagemErroApi(causa, "Não foi possível obter a localização."));
        } finally {
            setMostrarCoordenadas(true);
            setLocalizando(false);
        }
    }

    async function salvar(evento: FormEvent) {
        evento.preventDefault(); setErro(""); setAviso("");
        const cep = digitos(form.cep);
        if (cep.length !== 8) { setErro("Informe um CEP com 8 dígitos."); return; }
        const lat = form.latitude.trim().replace(",", "."); const lng = form.longitude.trim().replace(",", ".");
        if (Boolean(lat) !== Boolean(lng)) { setErro("Informe latitude e longitude juntas ou deixe ambas vazias."); return; }
        const latitude = lat ? Number(lat) : null; const longitude = lng ? Number(lng) : null;
        if (latitude !== null && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) { setErro("Informe uma latitude válida entre -90 e 90."); return; }
        if (longitude !== null && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) { setErro("Informe uma longitude válida entre -180 e 180."); return; }
        setSalvando(true);
        try {
            const dados = { cep, numero: form.numero.trim(), latitude, longitude };
            const atualizado = endereco ? await atualizarEndereco(endereco.id, dados) : await criarEndereco(dados);
            setEndereco(atualizado); preencher(atualizado);
            if (enderecoVinculadoId !== atualizado.id) await onEnderecoCriado(atualizado.id);
            setAviso("Endereço salvo com sucesso.");
        } catch (causa) { setErro(obterMensagemErroApi(causa, "Erro ao salvar o endereço.")); }
        finally { setSalvando(false); }
    }
    return (
        <section className={estilos.card} aria-labelledby="endereco-loja-titulo">
            <div className={estilos.cabecalhoCard}>
                <span className={`${estilos.iconeCabecalho} ${estilos.azul}`}><MapPin size={28} aria-hidden /></span>
                <div className={estilos.textoCabecalho}><h2 id="endereco-loja-titulo">Endereço da loja</h2><p>Informe o CEP: a rua, o bairro, a cidade e o estado são preenchidos automaticamente. As coordenadas permitem calcular a proximidade no aplicativo.</p></div>
            </div>
            {carregando ? <p className={estilos.subtitulo}>Carregando endereço…</p> : (
                <form onSubmit={salvar} className={estilos.formEndereco}>
                    <div className={estilos.linhaCep}>
                        <label className={estilos.campo}>CEP<div className={estilos.buscaCep}>
                            <input aria-label="CEP" value={form.cep} placeholder="00000-000" inputMode="numeric" maxLength={9} required onBlur={() => { if (digitos(form.cep).length === 8 && !geografia.cidade) void consultarCep(); }} onChange={evento => { const cep = formatarCep(evento.target.value); cepAtual.current = digitos(cep); consulta.current?.abort(); setConsultando(false); setForm(atual => ({ ...atual, cep })); setGeografia(geografiaVazia); }} />
                            <button type="button" aria-label="Consultar CEP" disabled={consultando} onClick={() => void consultarCep()}><Search size={19} aria-hidden /></button>
                        </div></label>
                        <button type="button" className={estilos.botaoSecundario} onClick={usarLocalizacao} disabled={localizando || salvando}><LocateFixed size={19} aria-hidden />{localizando ? "Obtendo localização…" : "Usar minha localização"}</button>
                    </div>
                    <div className={estilos.linhaRua}>
                        <label className={estilos.campo}>Rua<input value={geografia.rua} readOnly placeholder="Preenchida pelo CEP" /></label>
                        <label className={estilos.campo}>Número<input value={form.numero} placeholder="Nº" onChange={evento => setForm(atual => ({ ...atual, numero: evento.target.value }))} /></label>
                    </div>
                    <div className={estilos.linhaCidade}>
                        <label className={estilos.campo}>Bairro<input value={geografia.bairro} readOnly placeholder="Pelo CEP" /></label>
                        <label className={estilos.campo}>Cidade<input value={geografia.cidade} readOnly placeholder="Pelo CEP" /></label>
                        <label className={estilos.campo}>Estado<input value={geografia.uf} readOnly placeholder="UF" /></label>
                    </div>
                    <details className={estilos.coordenadas} open={mostrarCoordenadas} onToggle={evento => setMostrarCoordenadas(evento.currentTarget.open)}><summary>Coordenadas da loja (opcional)</summary><div>
                        <label className={estilos.campo}>Latitude<input inputMode="decimal" value={form.latitude} placeholder="-20.211" onChange={evento => setForm(atual => ({ ...atual, latitude: evento.target.value }))} /></label>
                        <label className={estilos.campo}>Longitude<input inputMode="decimal" value={form.longitude} placeholder="-50.927" onChange={evento => setForm(atual => ({ ...atual, longitude: evento.target.value }))} /></label>
                    </div></details>
                    {consultando ? <p role="status" className={estilos.subtitulo}>Consultando CEP…</p> : null}
                    <div><button type="submit" disabled={salvando || consultando} className={estilos.botaoPrimario}><MapPin size={18} aria-hidden />{salvando ? "Salvando…" : "Salvar endereço"}</button></div>
                </form>
            )}
            {erro ? <p role="alert" className={estilos.textoErro}>{erro}</p> : null}
            {aviso ? <p role="status" className={estilos.textoSucesso}>{aviso}</p> : null}
        </section>
    );
}
