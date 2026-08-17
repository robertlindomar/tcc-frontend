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
    const tamanho = missao.sistema ? 320 : 256;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 print:static print:bg-white">
            <div className="w-full max-w-md bg-white p-6 shadow-xl print:shadow-none">
                <div className="mb-4 flex items-start justify-between gap-4 print:hidden">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">
                            {missao.sistema ? missao.nome : "QR Code da missão"}
                        </h2>
                        {!missao.sistema && (
                            <p className="mt-1 text-sm text-slate-600">{missao.nome}</p>
                        )}
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

                {missao.sistema && (
                    <h2 className="mb-4 hidden text-center text-2xl font-semibold text-slate-900 print:block">
                        {missao.nome}
                    </h2>
                )}

                {missao.expirada && (
                    <div className="mb-4 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 print:hidden">
                        Missão expirada — este QR não concede mais pontos.
                    </div>
                )}

                <div className="flex justify-center bg-white p-4">
                    <QRCodeSVG value={payload} size={tamanho} />
                </div>

                {missao.sistema ? (
                    <p className="mt-3 text-center text-sm text-slate-700">
                        Escaneie uma vez por dia e ganhe {missao.pontoRecompensa} pontos.
                    </p>
                ) : (
                    <p className="mt-2 text-center text-sm text-slate-600">
                        {missao.pontoRecompensa} pontos
                    </p>
                )}

                <p className="mt-3 break-all text-center text-xs text-slate-500 print:hidden">
                    {payload}
                </p>

                <div className="mt-5 flex justify-end gap-2 print:hidden">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        Imprimir
                    </button>
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
