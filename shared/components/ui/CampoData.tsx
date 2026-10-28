"use client";

import { ReactNode } from "react";
import { DATA_MAXIMA_INPUT, dataMinimaPermitida } from "@/shared/utils/dataCivil";

interface CampoDataProps {
    rotulo: string;
    valor: string;
    onChange: (valor: string) => void;
    obrigatorio?: boolean;
    /** Data já salva; continua aceita mesmo se estiver no passado. */
    valorOriginal?: string | null;
    /** Limite inferior extra (ex.: fim não pode ser antes do início). */
    minimo?: string;
    dica?: ReactNode;
    className?: string;
}

/** Campo de data com ano de 4 dígitos e sem datas anteriores a hoje. */
export function CampoData({
    rotulo,
    valor,
    onChange,
    obrigatorio = false,
    valorOriginal,
    minimo,
    dica,
    className = "mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-white px-3 py-2 text-navy outline-none focus:border-primary",
}: CampoDataProps) {
    const minimoPermitido = dataMinimaPermitida(valorOriginal);
    const min = minimo && minimo > minimoPermitido ? minimo : minimoPermitido;

    return (
        <label className="block text-sm font-medium text-navy">
            {rotulo}
            <input
                type="date"
                min={min}
                max={DATA_MAXIMA_INPUT}
                value={valor}
                onChange={(event) => onChange(event.target.value)}
                className={className}
                required={obrigatorio}
            />
            {dica ? (
                <span className="mt-1 block text-xs font-normal text-muted">{dica}</span>
            ) : null}
        </label>
    );
}
