"use client";

import { Search, X } from "lucide-react";

interface CampoBuscaProps {
    valor: string;
    onChange: (valor: string) => void;
    placeholder: string;
    /** Texto exibido ao lado do campo, ex.: "3 produtos". */
    rotuloContagem?: string;
}

/** Campo de busca padrão das listagens do painel. */
export function CampoBusca({
    valor,
    onChange,
    placeholder,
    rotuloContagem,
}: CampoBuscaProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block flex-1">
                <span className="sr-only">{placeholder}</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                    type="search"
                    value={valor}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-full border border-border bg-white py-2.5 pl-10 pr-10 text-sm text-navy outline-none focus:border-primary [&::-webkit-search-cancel-button]:hidden"
                />
                {valor ? (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        aria-label="Limpar busca"
                        className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-primary-muted hover:text-navy"
                    >
                        <X className="h-4 w-4" />
                    </button>
                ) : null}
            </label>
            {rotuloContagem ? (
                <p className="shrink-0 text-sm text-muted">{rotuloContagem}</p>
            ) : null}
        </div>
    );
}
