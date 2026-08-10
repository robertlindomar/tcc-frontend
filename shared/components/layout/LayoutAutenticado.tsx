"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
    buscarUsuarioLogadoAtual,
    sair,
} from "@/modules/auth/services/servicoAuth";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";
import {
    itensNavegacaoPorPapel,
    tituloPainelPorPapel,
    type ItemNavegacao,
} from "./itensNavegacao";

function ItemSidebar({
    item,
    ativo,
    onNavigate,
}: {
    item: ItemNavegacao;
    ativo: boolean;
    onNavigate?: () => void;
}) {
    const Icone = item.icone;
    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                ativo
                    ? "bg-primary-muted text-primary"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
        >
            <Icone className="h-5 w-5 shrink-0" aria-hidden />
            {item.label}
        </Link>
    );
}

function ConteudoSidebar({
    papel,
    onNavigate,
}: {
    papel: PapelUsuario | null;
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
        <div className="flex h-full flex-col">
            <div className="border-b border-border px-4 py-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Conecta Comércio
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                    {tituloPainelPorPapel(papel)}
                </p>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Principal">
                {itens.map((item) => (
                    <ItemSidebar
                        key={item.href}
                        item={item}
                        ativo={pathname === item.href}
                        onNavigate={onNavigate}
                    />
                ))}
            </nav>

            <div className="border-t border-border p-3">
                <button
                    type="button"
                    onClick={handleSair}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                    <LogOut className="h-5 w-5" aria-hidden />
                    Sair
                </button>
            </div>
        </div>
    );
}

export function LayoutAutenticado({ children }: { children: React.ReactNode }) {
    const [menuAberto, setMenuAberto] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("Usuário");
    const [papel, setPapel] = useState<PapelUsuario | null>(null);

    useEffect(() => {
        const sessao = buscarUsuarioLogadoAtual();
        if (sessao?.usuario?.nome) {
            setNomeUsuario(sessao.usuario.nome);
        }
        if (sessao?.usuario?.role) {
            setPapel(sessao.usuario.role);
        }
    }, []);

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
            <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
                <ConteudoSidebar papel={papel} />
            </aside>

            {menuAberto ? (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-slate-900/40"
                        aria-label="Fechar menu"
                        onClick={() => setMenuAberto(false)}
                    />
                    <aside className="relative z-50 h-full w-72 bg-sidebar shadow-xl">
                        <div className="flex justify-end p-2">
                            <button
                                type="button"
                                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                                onClick={() => setMenuAberto(false)}
                                aria-label="Fechar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <ConteudoSidebar
                            papel={papel}
                            onNavigate={() => setMenuAberto(false)}
                        />
                    </aside>
                </div>
            ) : null}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            onClick={() => setMenuAberto(true)}
                            aria-label="Abrir menu"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <p className="truncate text-sm font-medium text-slate-800 sm:text-base">
                            {tituloHeader}
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
                        <span className="hidden sm:inline">{nomeUsuario}</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
                            {nomeUsuario.slice(0, 1).toUpperCase()}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}
