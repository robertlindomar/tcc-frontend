import { InputHTMLAttributes, ReactNode } from "react";

interface CampoFormularioProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    erro?: string;
    labelVisivel?: boolean;
    leftIcon?: ReactNode;
    rightElement?: ReactNode;
}

export function CampoFormulario({
    label,
    erro,
    id,
    className,
    labelVisivel = true,
    leftIcon,
    rightElement,
    ...props
}: CampoFormularioProps) {
    const inputId = id ?? props.name;
    const inputPadding = [
        leftIcon ? "pl-11" : "pl-3",
        rightElement ? "pr-11" : "pr-3",
    ].join(" ");

    return (
        <div className="space-y-1">
            <label
                htmlFor={inputId}
                className={labelVisivel ? "text-sm font-medium text-navy" : "sr-only"}
            >
                {label}
            </label>

            <div className="relative">
                {leftIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    className={`w-full rounded-xl border border-[#d7ded9] bg-white py-3 text-sm text-[#0f172a] outline-none transition placeholder:text-[#94a3b8] focus:border-[#02C394] focus:ring-2 focus:ring-[#d8f3ea] ${inputPadding} ${className ?? ""}`}
                    {...props}
                />

                {rightElement && (
                    <span className="absolute right-3 top-1/2 flex -translate-y-1/2 text-muted">
                        {rightElement}
                    </span>
                )}
            </div>

            {erro && <p className="text-xs text-red-600">{erro}</p>}
        </div>
    );
}
