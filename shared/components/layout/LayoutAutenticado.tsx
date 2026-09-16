"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { sair } from "@/modules/auth/services/servicoAuth";
import { buscarMeuPerfilLojista } from "@/modules/lojistas/services/servicoLojista";
import type { StatusLojista } from "@/modules/lojistas/types/lojista.types";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";
import { useSessaoUsuario } from "@/shared/hooks/useSessaoUsuario";
import {
    itensNavegacaoPorPapel,
    type ItemNavegacao,
} from "./itensNavegacao";

function ItemSidebar({
    item,
    ativo,
    bloqueado,
    onNavigate,
}: {
    item: ItemNavegacao;
    ativo: boolean;
    bloqueado: boolean;
    onNavigate?: () => void;
}) {
    const Icone = item.icone;
    const classeBase =
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors";

    if (bloqueado) {
        return (
            <span
                className={`${classeBase} cursor-not-allowed text-white/30`}
                title="Disponível após a aprovação da sua loja"
                aria-disabled
            >
                <Icone className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
                {item.label}
            </span>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={`${classeBase} ${
                ativo
                    ? "bg-[#02C394]/18 text-white"
                    : "text-white/75 hover:bg-white/[0.06] hover:text-white"
            }`}
        >
            {ativo ? (
                <span
                    aria-hidden
                    className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-[#02C394]"
                />
            ) : null}
            <Icone
                className={`h-[18px] w-[18px] shrink-0 ${ativo ? "text-[#02C394]" : "text-white/70"}`}
                strokeWidth={1.75}
                aria-hidden
            />
            {item.label}
        </Link>
    );
}

function ConteudoSidebar({
    papel,
    statusLoja,
    onNavigate,
}: {
    papel: PapelUsuario | null;
    statusLoja: StatusLojista | null;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const itens = itensNavegacaoPorPapel(papel);

    function handleSair() {
        sair();
        router.replace("/login");
        onNavigate?.();
    }

    return (
        <div className="relative flex h-full flex-col overflow-hidden bg-[#0B1416] text-white">
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-16 h-64 w-64 rounded-full bg-[#02C394]/20 blur-3xl"
            />

            <div className="relative z-10 flex justify-center px-4 pb-2 pt-7">
                <div className="text-left">
                    <Image
                        src="/marca/conecta-comercio-logo-horizontal-clara.svg"
                        alt="Conecta Comércio"
                        width={240}
                        height={77}
                        className="h-14 w-auto"
                        priority
                    />
                    <p className="mt-2.5 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-white/50">
                        Comércio local
                        <br />
                        Mais forte juntos
                    </p>
                </div>
            </div>

            <nav
                className="relative z-10 mt-6 flex-1 space-y-1 overflow-y-auto px-3"
                aria-label="Principal"
            >
                {itens.map((item) => (
                    <ItemSidebar
                        key={item.href}
                        item={item}
                        ativo={pathname === item.href}
                        bloqueado={Boolean(
                            item.exigeLojaAprovada && statusLoja !== "APROVADO",
                        )}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>

            <div className="relative z-10 space-y-4 px-3 pb-5 pt-4">
                <div className="rounded-2xl border border-white/10 bg-[#121c1e]/90 p-4 shadow-[0_0_40px_rgba(2,195,148,0.12)]">
                    <Sparkles className="mb-2.5 h-4 w-4 text-[#02C394]" aria-hidden />
                    <p className="text-[13px] font-semibold leading-snug text-white">
                        Fortalecendo o comércio local
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">
                        Mais lojas, mais pessoas, mais histórias.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSair}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                    <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                    Sair
                </button>
            </div>
        </div>
    );
}

export function LayoutAutenticado({ children }: { children: React.ReactNode }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const { papel, nome: nomeUsuario } = useSessaoUsuario();
    const [statusLoja, setStatusLoja] = useState<StatusLojista | null>(null);

    useEffect(() => {
        if (papel !== "LOJISTA") {
            return;
        }

        let cancelado = false;

        buscarMeuPerfilLojista()
            .then((perfil) => {
                if (!cancelado) {
                    setStatusLoja(perfil?.status ?? null);
                }
            })
            .catch(() => {
                // Sem status conhecido o menu mantém os recursos comerciais
                // bloqueados; a própria página explica o motivo.
            });

        return () => {
            cancelado = true;
        };
    }, [papel]);

    const tituloHeader =
        papel === "ASSOCIACAO"
            ? "Associação"
            : papel === "LOJISTA"
              ? "Lojista"
              : papel === "CONSUMIDOR"
                ? "Consumidor"
                : "Conecta Comércio";

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <aside className="hidden w-[272px] shrink-0 lg:block">
                <ConteudoSidebar papel={papel} statusLoja={statusLoja} />
            </aside>

            {menuAberto ? (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50"
                        aria-label="Fechar menu"
                        onClick={() => setMenuAberto(false)}
                    />
                    <aside className="relative z-50 h-full w-[280px] shadow-xl">
                        <div className="absolute right-2 top-2 z-10">
                            <button
                                type="button"
                                className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
                                onClick={() => setMenuAberto(false)}
                                aria-label="Fechar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <ConteudoSidebar
                            papel={papel}
                            statusLoja={statusLoja}
                            onNavigate={() => setMenuAberto(false)}
                        />
                    </aside>
                </div>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-muted hover:bg-primary-muted lg:hidden"
                            onClick={() => setMenuAberto(true)}
                            aria-label="Abrir menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <p className="painel-eyebrow truncate">{tituloHeader}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-muted">
                        <div className="hidden text-right sm:block">
                            <p className="font-medium text-navy">{nomeUsuario}</p>
                            <p className="text-xs">{tituloHeader}</p>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                            {nomeUsuario.slice(0, 1).toUpperCase()}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
