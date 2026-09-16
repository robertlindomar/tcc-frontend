import { ButtonHTMLAttributes } from "react";

interface BotaoAuthProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    carregando?: boolean;
}

export function BotaoAuth({
    children,
    carregando = false,
    disabled,
    className,
    ...props
}: BotaoAuthProps) {
    return (
        <button
            disabled={disabled || carregando}
            className={`w-full rounded-full bg-sidebar px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#0a261d] disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
            {...props}
        >
            {carregando ? "Aguarde..." : children}
        </button>
    );
}
