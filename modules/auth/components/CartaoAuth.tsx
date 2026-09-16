import { ReactNode } from "react";

interface CartaoAuthProps {
    titulo: string;
    subtitulo: string;
    children: ReactNode;
    rodape?: ReactNode;
}

export function CartaoAuth({ titulo, subtitulo, children, rodape }: CartaoAuthProps) {
    return (
        <div className="painel-card w-full max-w-md p-7 sm:p-8">
            <div className="mb-6">
                <p className="painel-eyebrow">Conecta Comércio</p>
                <h1 className="painel-titulo mt-2 text-2xl">{titulo}</h1>
                <p className="painel-subtitulo">{subtitulo}</p>
            </div>

            {children}

            {rodape && (
                <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted">
                    {rodape}
                </div>
            )}
        </div>
    );
}
