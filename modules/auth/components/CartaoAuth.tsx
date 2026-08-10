import { ReactNode } from "react";

interface CartaoAuthProps {
    titulo: string;
    subtitulo: string;
    children: ReactNode;
    rodape?: ReactNode;
}

export function CartaoAuth({ titulo, subtitulo, children, rodape }: CartaoAuthProps) {
    return (
        <div className="w-full max-w-md rounded-[var(--radius)] border border-border bg-surface p-8 shadow-sm">
            <div className="mb-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Conecta Comércio
                </p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900">{titulo}</h1>
                <p className="mt-2 text-sm text-muted">{subtitulo}</p>
            </div>

            {children}

            {rodape && (
                <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
                    {rodape}
                </div>
            )}
        </div>
    );
}
