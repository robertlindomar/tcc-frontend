import { Gift, Megaphone, Store, Users, type LucideIcon } from "lucide-react";

export function CartaoMetrica({
    valor,
    rotulo,
    icone: Icone,
    tom = "primary",
}: {
    valor: number;
    rotulo: string;
    icone: LucideIcon;
    tom?: "primary" | "emerald" | "amber";
}) {
    const tons = {
        primary: "bg-primary-muted text-primary",
        emerald: "bg-emerald-50 text-emerald-700",
        amber: "bg-amber-50 text-amber-700",
    } as const;

    return (
        <article className="flex items-center gap-4 rounded-[var(--radius)] border border-border bg-surface p-4 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tons[tom]}`}>
                <Icone className="h-6 w-6" aria-hidden />
            </div>
            <div>
                <p className="text-2xl font-semibold tabular-nums text-slate-900">
                    {String(valor).padStart(2, "0")}
                </p>
                <p className="text-sm text-muted">{rotulo}</p>
            </div>
        </article>
    );
}

export const ICONES_METRICA = {
    lojasPendentes: Store,
    campanhas: Megaphone,
    sorteios: Gift,
    participantes: Users,
} as const;
