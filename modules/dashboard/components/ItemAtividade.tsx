import { CheckCircle2, Gift, Megaphone, Store } from "lucide-react";
import { AtividadeDashboard, TipoAtividadeDashboard } from "../types/dashboard.types";

const ICONE_POR_TIPO: Record<
    TipoAtividadeDashboard,
    typeof Store
> = {
    LOJA_PENDENTE: Store,
    LOJA_APROVADA: CheckCircle2,
    CAMPANHA_CRIADA: Megaphone,
    SORTEIO_CRIADO: Gift,
};

function formatarQuando(iso: string): string {
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) {
        return iso;
    }
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(data);
}

export function ItemAtividade({ atividade }: { atividade: AtividadeDashboard }) {
    const Icone = ICONE_POR_TIPO[atividade.tipo] ?? Store;

    return (
        <li className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted text-primary">
                <Icone className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-800">{atividade.titulo}</p>
                <p className="mt-0.5 text-xs text-muted">
                    {formatarQuando(atividade.ocorridoEm)}
                </p>
            </div>
        </li>
    );
}
