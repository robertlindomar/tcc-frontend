"use client";

import { QRCodeSVG } from "qrcode.react";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import { montarPayloadQrMissao } from "@/shared/utils/payloadQrMissao";
import type { Missao } from "@/modules/missoes/types/missao.types";

interface ModalQrMissaoProps {
    missao: Missao;
    onFechar: () => void;
}

export function ModalQrMissao({ missao, onFechar }: ModalQrMissaoProps) {
    const payload = montarPayloadQrMissao(missao.tokenQr);
    const tamanho = missao.sistema ? 320 : 256;

    return (
        <ModalOverlay
            onFechar={onFechar}
            largura="sm"
            classNamePainel="print:shadow-none"
        >
            <div className="mb-4 flex items-start justify-between gap-4 print:hidden">
                <div>
                    <h2 className="text-xl font-semibold text-navy">
                        {missao.sistema ? missao.nome : "QR Code da missão"}
                    </h2>
                    {!missao.sistema && (
                        <p className="mt-1 text-sm text-muted">{missao.nome}</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onFechar}
                    className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy"
                    aria-label="Fechar"
                >
                    x
                </button>
            </div>

            {missao.sistema && (
                <h2 className="mb-4 hidden text-center text-2xl font-semibold text-navy print:block">
                    {missao.nome}
                </h2>
            )}

            {missao.expirada && (
                <div className="mb-4 rounded-[var(--radius-sm)] border border-[#ffc9c3] bg-[#fff5f3] px-3 py-2 text-sm text-[#b91c1c] print:hidden">
                    Missão expirada — este QR não concede mais pontos.
                </div>
            )}

            <div className="flex justify-center rounded-[var(--radius-sm)] bg-white p-4">
                <QRCodeSVG value={payload} size={tamanho} />
            </div>

            {missao.sistema ? (
                <p className="mt-3 text-center text-sm text-navy">
                    Escaneie uma vez por dia e ganhe {missao.pontoRecompensa} pontos.
                </p>
            ) : (
                <p className="mt-2 text-center text-sm text-muted">
                    {missao.pontoRecompensa} pontos
                </p>
            )}

            <p className="mt-3 break-all text-center text-xs text-muted print:hidden">
                {payload}
            </p>

            <div className="mt-5 flex justify-end gap-2 print:hidden">
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn-secundario text-sm"
                >
                    Imprimir
                </button>
                <button
                    type="button"
                    onClick={onFechar}
                    className="btn-secundario text-sm"
                >
                    Fechar
                </button>
            </div>
        </ModalOverlay>
    );
}
