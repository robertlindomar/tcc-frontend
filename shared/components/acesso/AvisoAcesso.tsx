import Link from "next/link";
import type { ReactNode } from "react";

export type TomAviso = "neutro" | "aguardando" | "negado";

const ESTILO_POR_TOM: Record<TomAviso, string> = {
    neutro: "border-slate-200 bg-slate-50 text-slate-700",
    aguardando: "border-amber-200 bg-amber-50 text-amber-900",
    negado: "border-red-200 bg-red-50 text-red-800",
};

type AvisoAcessoProps = {
    titulo: string;
    mensagem: string;
    tom?: TomAviso;
    acao?: { href: string; label: string };
    children?: ReactNode;
};

/**
 * Estado padrão para acesso indisponível (papel, status da loja ou 403).
 * Evita expor erro técnico e não revela recursos de outro tenant.
 */
export function AvisoAcesso({
    titulo,
    mensagem,
    tom = "neutro",
    acao,
    children,
}: AvisoAcessoProps) {
    return (
        <section className="mx-auto max-w-xl space-y-4 py-6">
            <h1 className="text-2xl font-semibold text-slate-900">{titulo}</h1>

            <div
                className={`space-y-3 rounded-[var(--radius)] border px-4 py-3 text-sm ${ESTILO_POR_TOM[tom]}`}
                role="status"
            >
                <p>{mensagem}</p>
                {children}
                {acao ? (
                    <Link href={acao.href} className="inline-block font-semibold underline">
                        {acao.label}
                    </Link>
                ) : null}
            </div>
        </section>
    );
}
