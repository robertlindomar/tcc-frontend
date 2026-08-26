"use client";

import { ReactNode } from "react";
import { Lojista, StatusLojista } from "../types/lojista.types";

const ROTULO_STATUS: Record<StatusLojista, string> = {
    PENDENTE: "Em análise",
    APROVADO: "Aprovada",
    REJEITADO: "Não aprovada",
};

type ModalDetalheLojistaProps = {
    lojista: Lojista;
    titulo?: string;
    onFechar: () => void;
    acoes?: ReactNode;
};

function formatarData(data: Date) {
    return data.toLocaleString("pt-BR");
}

export function ModalDetalheLojista({
    lojista,
    titulo = "Detalhes da loja",
    onFechar,
    acoes,
}: ModalDetalheLojistaProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md space-y-4 rounded-[var(--radius)] bg-surface p-6 shadow-xl">
                <h2 className="text-lg font-semibold">{titulo}</h2>
                <dl className="space-y-2 text-sm">
                    <div>
                        <dt className="text-muted">ID</dt>
                        <dd className="font-medium">#{lojista.id}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">Nome fantasia</dt>
                        <dd className="font-medium">{lojista.nomeFantasia}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">Razão social</dt>
                        <dd className="font-medium">{lojista.razaoSocial}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">CNPJ</dt>
                        <dd className="font-medium">{lojista.cnpj}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">E-mail</dt>
                        <dd className="font-medium">{lojista.email || "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">Inscrição estadual</dt>
                        <dd className="font-medium">
                            {lojista.inscricaoEstadual ?? "—"}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted">Status</dt>
                        <dd className="font-medium">{ROTULO_STATUS[lojista.status]}</dd>
                    </div>
                    <div>
                        <dt className="text-muted">Data de cadastro</dt>
                        <dd className="font-medium">
                            {formatarData(lojista.dataCriacao)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-muted">Última atualização</dt>
                        <dd className="font-medium">
                            {formatarData(lojista.dataAtualizacao)}
                        </dd>
                    </div>
                    {lojista.justificativaRejeicao ? (
                        <div>
                            <dt className="text-muted">Justificativa de rejeição</dt>
                            <dd className="font-medium">
                                {lojista.justificativaRejeicao}
                            </dd>
                        </div>
                    ) : null}
                </dl>
                <div className="flex flex-wrap justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onFechar}
                        className="border border-border px-4 py-2 text-sm font-semibold"
                    >
                        Fechar
                    </button>
                    {acoes}
                </div>
            </div>
        </div>
    );
}
