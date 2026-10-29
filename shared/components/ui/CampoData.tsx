"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useId, useRef, useState } from "react";
import {
    brParaIso,
    DATA_MAXIMA_INPUT,
    dataMinimaPermitida,
    hojeIsoCivil,
    isoParaBr,
    mascararDataBr,
    montarGradeMes,
    somarMeses,
} from "@/shared/utils/dataCivil";

interface CampoDataProps {
    rotulo: string;
    valor: string;
    onChange: (valor: string) => void;
    obrigatorio?: boolean;
    /** Data já salva; continua aceita mesmo se estiver no passado. */
    valorOriginal?: string | null;
    /** Limite inferior extra (ex.: fim não pode ser antes do início). */
    minimo?: string;
    dica?: ReactNode;
    className?: string;
}

const LARGURA_CALENDARIO = 288;
const ALTURA_CALENDARIO = 340;

const DIAS_SEMANA = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

function nomeMes(anoMes: string): string {
    const [ano, mes] = anoMes.split("-").map(Number);
    return new Date(Date.UTC(ano, mes - 1, 1)).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    });
}

/**
 * Campo de data `dd/mm/aaaa` com calendário próprio: dias disponíveis (inclusive hoje)
 * em branco, só os indisponíveis apagados. Ano sempre com 4 dígitos; sem datas passadas.
 */
export function CampoData({
    rotulo,
    valor,
    onChange,
    obrigatorio = false,
    valorOriginal,
    minimo,
    dica,
    className = "mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary",
}: CampoDataProps) {
    const id = useId();
    const raiz = useRef<HTMLDivElement>(null);
    const campo = useRef<HTMLDivElement>(null);
    const hoje = hojeIsoCivil();
    const minimoPermitido = dataMinimaPermitida(valorOriginal);
    const min = minimo && minimo > minimoPermitido ? minimo : minimoPermitido;

    const [texto, setTexto] = useState(() => isoParaBr(valor));
    const [valorExibido, setValorExibido] = useState(valor);
    const [aberto, setAberto] = useState(false);
    const [posicao, setPosicao] = useState({ top: 0, left: 0 });
    const [mesVisivel, setMesVisivel] = useState(() => (valor || (min > hoje ? min : hoje)).slice(0, 7));

    if (valor !== valorExibido) {
        setValorExibido(valor);
        setTexto(isoParaBr(valor));
    }

    useEffect(() => {
        if (!aberto) return;
        function fecharFora(evento: MouseEvent) {
            if (raiz.current && !raiz.current.contains(evento.target as Node)) setAberto(false);
        }
        function fecharEsc(evento: KeyboardEvent) {
            if (evento.key === "Escape") {
                evento.stopPropagation();
                setAberto(false);
            }
        }
        function fechar() {
            setAberto(false);
        }
        document.addEventListener("mousedown", fecharFora);
        document.addEventListener("keydown", fecharEsc, true);
        window.addEventListener("resize", fechar);
        window.addEventListener("scroll", fechar, true);
        return () => {
            document.removeEventListener("mousedown", fecharFora);
            document.removeEventListener("keydown", fecharEsc, true);
            window.removeEventListener("resize", fechar);
            window.removeEventListener("scroll", fechar, true);
        };
    }, [aberto]);

    function emitir(novo: string) {
        setValorExibido(novo);
        onChange(novo);
    }

    function digitar(entrada: string) {
        const mascarado = mascararDataBr(entrada);
        setTexto(mascarado);
        const iso = brParaIso(mascarado);
        emitir(iso ?? (mascarado ? mascarado : ""));
        if (iso) setMesVisivel(iso.slice(0, 7));
    }

    function escolher(iso: string) {
        setTexto(isoParaBr(iso));
        emitir(iso);
        setAberto(false);
    }

    function alternar() {
        if (!aberto) {
            setMesVisivel((valor && brParaIso(texto) ? valor : min > hoje ? min : hoje).slice(0, 7));
            const caixa = campo.current?.getBoundingClientRect();
            if (caixa) {
                const left = Math.max(8, Math.min(caixa.left, window.innerWidth - LARGURA_CALENDARIO - 8));
                const cabeAbaixo = caixa.bottom + ALTURA_CALENDARIO + 8 <= window.innerHeight;
                setPosicao({ left, top: cabeAbaixo ? caixa.bottom + 4 : Math.max(8, caixa.top - ALTURA_CALENDARIO - 4) });
            }
        }
        setAberto((atual) => !atual);
    }

    const indisponivel = (iso: string) => iso < min || iso > DATA_MAXIMA_INPUT;

    return (
        <div ref={raiz} className="relative block text-sm font-medium text-navy">
            <label htmlFor={id}>{rotulo}</label>
            <div ref={campo} className="relative">
                <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/mm/aaaa"
                    value={texto}
                    onChange={(evento) => digitar(evento.target.value)}
                    className={`${className} pr-10`}
                    required={obrigatorio}
                    autoComplete="off"
                />
                <button
                    type="button"
                    onClick={alternar}
                    aria-label={`Abrir calendário de ${rotulo}`}
                    aria-expanded={aberto}
                    className="absolute bottom-0 right-0 top-1 flex items-center px-3 text-muted hover:text-primary"
                >
                    <CalendarDays className="h-4 w-4" aria-hidden />
                </button>
            </div>

            {aberto ? (
                <div
                    role="dialog"
                    aria-label={`Calendário de ${rotulo}`}
                    style={{ top: posicao.top, left: posicao.left, width: LARGURA_CALENDARIO }}
                    className="fixed z-[200] rounded-xl border border-border bg-white p-3 shadow-lg"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMesVisivel((mes) => somarMeses(mes, -1))}
                            aria-label="Mês anterior"
                            className="rounded-full p-1 text-navy hover:bg-primary-muted"
                        >
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                        </button>
                        <span className="text-sm font-semibold capitalize text-navy">{nomeMes(mesVisivel)}</span>
                        <button
                            type="button"
                            onClick={() => setMesVisivel((mes) => somarMeses(mes, 1))}
                            aria-label="Próximo mês"
                            className="rounded-full p-1 text-navy hover:bg-primary-muted"
                        >
                            <ChevronRight className="h-4 w-4" aria-hidden />
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
                        {DIAS_SEMANA.map((dia) => (
                            <span key={dia}>{dia}</span>
                        ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-1">
                        {montarGradeMes(mesVisivel).map((dia) => {
                            const bloqueado = indisponivel(dia.iso);
                            const selecionado = dia.iso === valor;
                            const ehHoje = dia.iso === hoje;
                            let classe = "bg-white text-navy hover:bg-primary-muted";
                            if (bloqueado) classe = "cursor-not-allowed bg-white text-slate-300";
                            else if (selecionado) classe = "bg-primary font-semibold text-white";
                            else if (ehHoje) classe = "bg-white font-bold text-primary ring-1 ring-primary hover:bg-primary-muted";
                            else if (!dia.doMes) classe = "bg-white text-muted hover:bg-primary-muted";
                            return (
                                <button
                                    key={dia.iso}
                                    type="button"
                                    disabled={bloqueado}
                                    onClick={() => escolher(dia.iso)}
                                    aria-label={`${isoParaBr(dia.iso)}${ehHoje ? " (hoje)" : ""}`}
                                    aria-pressed={selecionado}
                                    className={`h-8 rounded-lg text-sm ${classe}`}
                                >
                                    {dia.dia}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                setTexto("");
                                emitir("");
                                setAberto(false);
                            }}
                            className="text-xs font-semibold text-muted hover:text-navy"
                        >
                            Limpar
                        </button>
                        {!indisponivel(hoje) ? (
                            <button
                                type="button"
                                onClick={() => escolher(hoje)}
                                className="text-xs font-semibold text-primary hover:text-primary-hover"
                            >
                                Hoje
                            </button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {dica ? (
                <span className="mt-1 block text-xs font-normal text-muted">{dica}</span>
            ) : null}
        </div>
    );
}
