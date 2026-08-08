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
                className={labelVisivel ? "text-sm font-medium text-slate-700" : "sr-only"}
            >
                {label}
            </label>

            <div className="relative">
                {leftIcon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-500">
                        {leftIcon}
                    </span>
                )}

                <input
                    id={inputId}
                    className={`w-full rounded-md border border-slate-300 bg-white py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${inputPadding} ${className ?? ""}`}
                    {...props}
                />

                {rightElement && (
                    <span className="absolute right-3 top-1/2 flex -translate-y-1/2 text-slate-500">
                        {rightElement}
                    </span>
                )}
            </div>

            {erro && <p className="text-xs text-red-600">{erro}</p>}
        </div>
    );
}
