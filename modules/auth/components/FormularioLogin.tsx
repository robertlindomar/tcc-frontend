"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
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
        <section className="w-full rounded-[1.35rem] border border-[#e5ebe7] bg-white px-9 pb-10 pt-9 shadow-[0_24px_60px_rgba(12,47,36,0.09)] sm:px-11 sm:pb-11 sm:pt-10">
            <div className="mb-7 flex items-center gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#d8f3ea] text-[#0c2f24]">
                    <Building2 className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <p className="text-[13px] font-bold uppercase leading-tight tracking-[0.04em] text-[#0f172a] sm:text-[14px]">
                    Associação Comercial Santa Fé do Sul
                </p>
            </div>

            <p className="mb-8 text-center text-[1.35rem] font-bold text-[#019575] sm:text-[1.5rem]">
                Área Administrativa
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {erro && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {erro}
                    </div>
                )}

                <CampoFormulario
                    label="E-mail"
                    labelVisivel={false}
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    leftIcon={<MailIcon />}
                    className="py-3.5 text-[15px]"
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
                    className="py-3.5 text-[15px]"
                    rightElement={
                        <button
                            type="button"
                            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            className="rounded text-[#64748b] transition hover:text-[#019575] focus:outline-none focus:ring-2 focus:ring-[#d8f3ea]"
                            onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
                        >
                            <EyeIcon />
                        </button>
                    }
                    required
                />

                <label className="flex w-fit items-center gap-2.5 text-[15px] font-medium text-[#64748b]">
                    <input
                        type="checkbox"
                        checked={lembrar}
                        onChange={(event) => setLembrar(event.target.checked)}
                        className="h-[1.05rem] w-[1.05rem] rounded border-[#cbd5e1] text-[#019575] focus:ring-[#d8f3ea]"
                    />
                    Lembrar-me
                </label>

                <button
                    type="submit"
                    disabled={carregando}
                    className="mt-2 w-full rounded-xl bg-[#02C394] px-4 py-4 text-[15px] font-bold uppercase tracking-wide text-white transition hover:bg-[#019575] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {carregando ? "Aguarde..." : "Entrar"}
                </button>

                <p className="pt-2 text-center text-[15px] text-[#64748b]">
                    É lojista?{" "}
                    <Link
                        href="/cadastro"
                        className="font-bold text-[#019575] underline underline-offset-2 hover:text-[#017a60]"
                    >
                        Cadastre sua loja
                    </Link>
                </p>
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
