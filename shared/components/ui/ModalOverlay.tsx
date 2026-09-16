"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type LarguraModal = "sm" | "md" | "lg" | "xl";

const LARGURAS: Record<LarguraModal, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
};

type ModalOverlayProps = {
    children: ReactNode;
    onFechar: () => void;
    /** Impede fechar por overlay / Esc (ex.: salvando). */
    bloqueado?: boolean;
    largura?: LarguraModal;
    /** Classes extras no painel interno. */
    classNamePainel?: string;
};

/**
 * Modal padrão do painel web: portal no body, fundo escurecido, Esc/overlay fecham.
 * Evita o bug de `fixed` preso dentro de `main` com overflow.
 */
export function ModalOverlay({
    children,
    onFechar,
    bloqueado = false,
    largura = "md",
    classNamePainel = "",
}: ModalOverlayProps) {
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        setMontado(true);
    }, []);

    useEffect(() => {
        if (!montado) {
            return;
        }
        const anterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = anterior;
        };
    }, [montado]);

    useEffect(() => {
        if (!montado) {
            return;
        }
        function onKey(event: KeyboardEvent) {
            if (event.key === "Escape" && !bloqueado) {
                onFechar();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [montado, bloqueado, onFechar]);

    if (!montado) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <button
                type="button"
                className="absolute inset-0 bg-[#050a08]/55 backdrop-blur-[2px]"
                aria-label="Fechar"
                disabled={bloqueado}
                onClick={() => {
                    if (!bloqueado) {
                        onFechar();
                    }
                }}
            />
            <div
                className={`relative z-10 max-h-[min(90vh,760px)] w-full overflow-y-auto rounded-2xl border border-border bg-white p-6 shadow-[0_24px_60px_rgba(12,47,36,0.2)] ${LARGURAS[largura]} ${classNamePainel}`}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
}
