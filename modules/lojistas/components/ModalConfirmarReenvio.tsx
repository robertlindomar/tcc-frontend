"use client";

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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-reenvio"
        >
            <div className="w-full max-w-md bg-white p-6 shadow-xl">
                <h2 id="titulo-reenvio" className="text-xl font-semibold text-slate-900">
                    Enviar seu cadastro novamente para análise?
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                    Confirme que você já corrigiu os dados indicados no motivo da
                    rejeição.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancelar}
                        disabled={salvando}
                        className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        disabled={salvando}
                        className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {salvando ? "Enviando…" : "Enviar para análise"}
                    </button>
                </div>
            </div>
        </div>
    );
}
