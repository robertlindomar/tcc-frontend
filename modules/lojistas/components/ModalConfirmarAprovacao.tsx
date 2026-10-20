"use client";

import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";

type ModalConfirmarAprovacaoProps = {
    nomeLoja: string;
    salvando: boolean;
    onCancelar: () => void;
    onConfirmar: () => void;
};

export function ModalConfirmarAprovacao({
    nomeLoja,
    salvando,
    onCancelar,
    onConfirmar,
}: ModalConfirmarAprovacaoProps) {
    return (
        <ModalOverlay onFechar={onCancelar} bloqueado={salvando} largura="sm">
            <h2 className="text-xl font-semibold text-navy">
                Aprovar pré-cadastro?
            </h2>
            <p className="mt-2 text-sm text-muted">
                Confirme a aprovação de {nomeLoja}. A loja passará a participar da
                associação.
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
                    {salvando ? "Aprovando…" : "Aprovar"}
                </button>
            </div>
        </ModalOverlay>
    );
}
