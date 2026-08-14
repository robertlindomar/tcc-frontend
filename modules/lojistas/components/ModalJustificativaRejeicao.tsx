"use client";

import { FormEvent, useState } from "react";

const TAMANHO_MAX = 500;

type ModalJustificativaRejeicaoProps = {
    nomeLoja: string;
    salvando: boolean;
    onCancelar: () => void;
    onConfirmar: (justificativa: string) => void;
};

export function ModalJustificativaRejeicao({
    nomeLoja,
    salvando,
    onCancelar,
    onConfirmar,
}: ModalJustificativaRejeicaoProps) {
    const [motivo, setMotivo] = useState("");
    const [erroLocal, setErroLocal] = useState("");

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const texto = motivo.trim();
        if (!texto) {
            setErroLocal("Informe o motivo da rejeição.");
            return;
        }
        if (texto.length > TAMANHO_MAX) {
            setErroLocal(`O motivo deve ter no máximo ${TAMANHO_MAX} caracteres.`);
            return;
        }
        onConfirmar(texto);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="w-full max-w-md bg-white p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-slate-900">Rejeitar cadastro</h2>
                <p className="mt-1 text-sm text-slate-600">
                    Informe o motivo da rejeição de {nomeLoja}.
                </p>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Motivo da rejeição
                        <textarea
                            value={motivo}
                            onChange={(event) => {
                                setMotivo(event.target.value);
                                setErroLocal("");
                            }}
                            rows={4}
                            maxLength={TAMANHO_MAX}
                            required
                            className="mt-1 w-full border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                        />
                    </label>
                    {erroLocal ? (
                        <p className="text-sm text-red-700">{erroLocal}</p>
                    ) : null}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancelar}
                            disabled={salvando}
                            className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {salvando ? "Rejeitando..." : "Rejeitar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
