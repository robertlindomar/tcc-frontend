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
            className={`w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
            {...props}
        >
            {carregando ? "Aguarde..." : children}
        </button>
    );
}
