import Link from "next/link";
import { Clock3, ShieldAlert, Users, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type TomAviso = "neutro" | "aguardando" | "negado";

const ESTILO_ICONE: Record<TomAviso, string> = {
    neutro: "bg-[#efeaff] text-violet-600",
    aguardando: "bg-amber-50 text-amber-700",
    negado: "bg-red-50 text-red-600",
};

const ICONE_POR_TOM: Record<TomAviso, LucideIcon> = {
    neutro: Users,
    aguardando: Clock3,
    negado: ShieldAlert,
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
    const Icone = ICONE_POR_TOM[tom];

    return (
        <div className="painel-pagina flex min-h-[55vh] items-center justify-center py-8">
            <section
                className="painel-card w-full max-w-xl space-y-4 px-8 py-12 text-center"
                role="status"
            >
                <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${ESTILO_ICONE[tom]}`}
                >
                    <Icone className="h-7 w-7" aria-hidden />
                </div>
                <h1 className="text-xl font-bold text-navy sm:text-2xl">{titulo}</h1>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
                    {mensagem}
                </p>
                {children}
                {acao ? (
                    <Link href={acao.href} className="btn-primario inline-flex text-sm">
                        {acao.label}
                    </Link>
                ) : null}
            </section>
        </div>
    );
}
