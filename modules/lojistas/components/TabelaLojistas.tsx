import { Lojista, StatusLojista } from "../types/lojista.types";

interface TabelaLojistasProps {
    lojistas: Lojista[];
    onEditar: (lojista: Lojista) => void;
    onExcluir: (lojista: Lojista) => void;
    onAprovar: (lojista: Lojista) => void;
    onRejeitar: (lojista: Lojista) => void;
    carregando?: boolean;
    excluindoId?: number | null;
    acaoStatusId?: number | null;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

const statusLabel: Record<StatusLojista, string> = {
    PENDENTE: "Pendente",
    APROVADO: "Aprovado",
    REJEITADO: "Rejeitado",
};

export function TabelaLojistas({
    lojistas,
    onEditar,
    onExcluir,
    onAprovar,
    onRejeitar,
    carregando = false,
    excluindoId = null,
    acaoStatusId = null,
}: TabelaLojistasProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1000px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome fantasia</th>
                        <th className="px-4 py-3 text-left font-semibold">CNPJ</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Associação</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                Carregando lojistas...
                            </td>
                        </tr>
                    )}

                    {!carregando && lojistas.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                Nenhum lojista cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        lojistas.map((lojista) => (
                            <tr key={lojista.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">
                                    {lojista.nomeFantasia}
                                </td>
                                <td className="px-4 py-3">{lojista.cnpj}</td>
                                <td className="px-4 py-3">{statusLabel[lojista.status]}</td>
                                <td className="px-4 py-3">{lojista.associacaoId}</td>
                                <td className="px-4 py-3">
                                    {formatarData(lojista.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {lojista.status === "PENDENTE" && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => onAprovar(lojista)}
                                                disabled={acaoStatusId === lojista.id}
                                                className="border border-emerald-200 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {acaoStatusId === lojista.id
                                                    ? "..."
                                                    : "Aprovar"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onRejeitar(lojista)}
                                                disabled={acaoStatusId === lojista.id}
                                                className="ml-2 border border-amber-200 px-3 py-1.5 font-medium text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Rejeitar
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onEditar(lojista)}
                                        className="ml-2 border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(lojista)}
                                        disabled={excluindoId === lojista.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === lojista.id
                                            ? "Excluindo..."
                                            : "Excluir"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
