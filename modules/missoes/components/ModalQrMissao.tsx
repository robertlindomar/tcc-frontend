"use client";

import { QRCodeSVG } from "qrcode.react";
import { montarPayloadQrMissao } from "@/shared/utils/payloadQrMissao";
import type { Missao } from "@/modules/missoes/types/missao.types";

interface ModalQrMissaoProps {
    missao: Missao;
    onFechar: () => void;
}

export function ModalQrMissao({ missao, onFechar }: ModalQrMissaoProps) {
    const payload = montarPayloadQrMissao(missao.tokenQr);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="w-full max-w-md bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            QR Code da missão
                        </h2>
                        <p className="mt-1 text-sm text-slate-600">{missao.nome}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onFechar}
                        className="px-2 py-1 text-2xl leading-none text-slate-500 hover:text-slate-900"
                        aria-label="Fechar"
                    >
                        x
                    </button>
                </div>

                {missao.expirada && (
                    <div className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                        Missão expirada — este QR não concede mais pontos.
                    </div>
                )}

                <div className="flex justify-center bg-white p-4">
                    <QRCodeSVG value={payload} size={256} />
                </div>

                <p className="mt-3 break-all text-center text-xs text-slate-500">
                    {payload}
                </p>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {missao.pontoRecompensa} pontos
                </p>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
