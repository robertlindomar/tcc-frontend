"use client";

import { ChangeEvent } from "react";

interface SeletorImagemProps {
    id: string;
    rotulo: string;
    previewUrl: string | null;
    onSelecionar: (arquivo: File | null) => void;
    desabilitado?: boolean;
    obrigatorio?: boolean;
}

export function SeletorImagem({
    id,
    rotulo,
    previewUrl,
    onSelecionar,
    desabilitado = false,
    obrigatorio = false,
}: SeletorImagemProps) {
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const arquivo = event.target.files?.[0] ?? null;
        onSelecionar(arquivo);
    }

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {rotulo}
                <input
                    id={id}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleChange}
                    disabled={desabilitado}
                    required={obrigatorio}
                    className="mt-1 block w-full text-sm text-slate-700 file:mr-3 file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5"
                />
            </label>
            {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={previewUrl}
                    alt="Pré-visualização da imagem"
                    className="h-24 w-24 border border-slate-200 object-cover"
                />
            ) : (
                <div className="flex h-24 w-24 items-center justify-center border border-dashed border-slate-300 text-xs text-slate-500">
                    Sem imagem
                </div>
            )}
        </div>
    );
}
