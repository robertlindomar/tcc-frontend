import { Gift, Megaphone, Store, Users, type LucideIcon } from "lucide-react";

export type TomMetrica = "verde" | "coral" | "ambar" | "roxo";

const TONS: Record<TomMetrica, { card: string; icone: string }> = {
    verde: {
        card: "bg-[#e8f7f2] border-[#c5ebe0]",
        icone: "bg-primary text-white",
    },
    coral: {
        card: "bg-[#fff0ee] border-[#ffd5d0]",
        icone: "bg-coral text-white",
    },
    ambar: {
        card: "bg-[#fff6e8] border-[#ffe0b5]",
        icone: "bg-amber-500 text-white",
    },
    roxo: {
        card: "bg-[#f3efff] border-[#ddd2ff]",
        icone: "bg-violet-500 text-white",
    },
};

export function CartaoMetrica({
    valor,
    rotulo,
    icone: Icone,
    tom = "verde",
}: {
    valor: number;
    rotulo: string;
    icone: LucideIcon;
    tom?: TomMetrica;
}) {
    const estilo = TONS[tom];

    return (
        <article
            className={`flex items-center gap-4 rounded-2xl border p-4 shadow-[var(--shadow-soft)] ${estilo.card}`}
        >
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${estilo.icone}`}
            >
                <Icone className="h-6 w-6" aria-hidden />
            </div>
            <div>
                <p className="text-2xl font-bold tabular-nums text-navy">
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
