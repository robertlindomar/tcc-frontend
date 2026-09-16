"use client";

import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";

type ModalConfirmarReenvioProps = {
    salvando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
};

export function ModalConfirmarReenvio({
    salvando,
    onCancelar,
    onConfirmar,
}: ModalConfirmarReenvioProps) {
    return (
        <ModalOverlay onFechar={onCancelar} bloqueado={salvando} largura="sm">
            <h2 id="titulo-reenvio" className="text-xl font-semibold text-navy">
                Enviar seu cadastro novamente para análise?
            </h2>
            <p className="mt-2 text-sm text-muted">
                Confirme que você já corrigiu os dados indicados no motivo da
                rejeição.
            </p>
            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancelar}
                    disabled={salvando}
                    className="btn-secundario text-sm disabled:opacity-60"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={onConfirmar}
                    disabled={salvando}
                    className="btn-primario text-sm disabled:opacity-60"
                >
                    {salvando ? "Enviando…" : "Enviar para análise"}
                </button>
            </div>
        </ModalOverlay>
    );
}
