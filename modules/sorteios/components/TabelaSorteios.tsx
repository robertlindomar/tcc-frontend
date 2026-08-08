import { Sorteio } from "../types/sorteio.types";

interface TabelaSorteiosProps {
    sorteios: Sorteio[];
    nomeCampanhaPorId: Record<number, string>;
    onEditar: (sorteio: Sorteio) => void;
    onExcluir: (sorteio: Sorteio) => void;
    carregando?: boolean;
    excluindoId?: number | null;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function TabelaSorteios({
    sorteios,
    nomeCampanhaPorId,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaSorteiosProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Campanha</th>
                        <th className="px-4 py-3 text-left font-semibold">QR Code</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                Carregando sorteios...
                            </td>
                        </tr>
                    )}

                    {!carregando && sorteios.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                Nenhum sorteio cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        sorteios.map((sorteio) => (
                            <tr key={sorteio.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">
                                    {nomeCampanhaPorId[sorteio.campanhaId] ??
                                        `#${sorteio.campanhaId}`}
                                </td>
                                <td className="px-4 py-3">{sorteio.qrcode ?? "—"}</td>
                                <td className="px-4 py-3">
                                    {formatarData(sorteio.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(sorteio)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(sorteio)}
                                        disabled={excluindoId === sorteio.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === sorteio.id
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
