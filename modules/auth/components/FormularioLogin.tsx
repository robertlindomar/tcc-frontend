"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { BotaoAuth } from "./BotaoAuth";
import { CampoFormulario } from "./CampoFormulario";
import { homePorPapel } from "@/shared/components/layout/itensNavegacao";
import { listarLojistas } from "@/modules/lojistas/services/servicoLojista";
import { buscarUsuarioLogadoAtual, entrar } from "../services/servicoAuth";
import { buscarToken } from "../services/servicoAuthApi";

async function destinoAposLogin(papel: string | undefined): Promise<string> {
    if (papel !== "LOJISTA") {
        return homePorPapel(papel as "ASSOCIACAO" | "LOJISTA" | "CONSUMIDOR" | undefined);
    }
    try {
        const lista = await listarLojistas();
        const perfil = lista[0];
        if (perfil?.status === "APROVADO") {
            return "/produtos";
        }
    } catch {
        // UX only — backend continua protegendo
    }
    return "/minha-loja";
}

export function FormularioLogin() {
    const router = useRouter();
    const redirecionou = useRef(false);

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrar, setLembrar] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (redirecionou.current) {
            return;
        }

        if (buscarToken()) {
            redirecionou.current = true;
            const sessao = buscarUsuarioLogadoAtual();
            void destinoAposLogin(sessao?.usuario?.role).then((href) => {
                router.replace(href);
            });
        }
    }, [router]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        try {
            const sessao = await entrar({
                email,
                senha,
            });

            redirecionou.current = true;
            const href = await destinoAposLogin(sessao.usuario.role);
            router.replace(href);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao fazer login."));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className="w-full max-w-[346px] rounded-lg border border-slate-300 bg-white px-5 pb-6 pt-5 shadow-sm">
            <div className="mb-5 flex items-center gap-4">
                <div className="grid h-14 w-20 shrink-0 place-items-center rounded-sm border border-blue-200 bg-white">
                    <div className="relative h-11 w-14 overflow-hidden rounded-sm">
                        <div className="absolute inset-1 rounded-full border-[6px] border-blue-700" />
                        <div className="absolute -right-1 top-1 h-9 w-9 rounded-full border-[6px] border-emerald-500" />
                        <div className="absolute -bottom-1 left-1 h-8 w-8 rounded-full border-[6px] border-cyan-500" />
                    </div>
                </div>

                <h1 className="text-[17px] font-bold leading-tight text-slate-950">
                    ASSOCIAÇÃO COMERCIAL
                    <br />
                    SANTA FÉ DO SUL
                </h1>
            </div>

            <p className="mb-4 text-center text-base font-bold text-blue-700">
                Área Administrativa
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                {erro && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {erro}
                    </div>
                )}

                <CampoFormulario
                    label="Email"
                    labelVisivel={false}
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    leftIcon={<MailIcon />}
                    required
                />

                <CampoFormulario
                    label="Senha"
                    labelVisivel={false}
                    name="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    leftIcon={<LockIcon />}
                    rightElement={
                        <button
                            type="button"
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            className="rounded text-slate-500 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
                        >
                            <EyeIcon />
                        </button>
                    }
                    required
                />

                <label className="flex w-fit items-center gap-2 text-sm font-semibold text-slate-600">
                    <input
                        type="checkbox"
                        checked={lembrar}
                        onChange={(event) => setLembrar(event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-100"
                    />
                    Lembrar-me
                </label>

                <BotaoAuth
                    type="submit"
                    carregando={carregando}
                    className="rounded-md bg-blue-700 py-3 text-base uppercase shadow-sm hover:bg-blue-800"
                >
                    Entrar
                </BotaoAuth>

                <div className="text-center">
                    <a
                        href="#"
                        className="text-sm font-bold text-blue-700 underline underline-offset-2 hover:text-blue-900"
                    >
                        Esqueceu sua senha?
                    </a>
                </div>
            </form>
        </section>
    );
}

function MailIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <rect height="11" rx="2" width="14" x="5" y="11" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
        >
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
