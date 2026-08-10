import { MissaoConsumidor } from "../types/missao-consumidor.types";

interface TabelaMissoesConcluidasProps {
    missoes: MissaoConsumidor[];
    carregando?: boolean;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function TabelaMissoesConcluidas({
    missoes,
    carregando = false,
}: TabelaMissoesConcluidasProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Missão</th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Pontos
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                            ID missão
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Concluída em
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-slate-500"
                            >
                                Carregando histórico...
                            </td>
                        </tr>
                    )}

                    {!carregando && missoes.length === 0 && (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-slate-500"
                            >
                                Nenhuma missão concluída ainda.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        missoes.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">
                                    {item.nomeMissao}
                                </td>
                                <td className="px-4 py-3">
                                    {item.pontoRecompensa}
                                </td>
                                <td className="px-4 py-3">#{item.missaoId}</td>
                                <td className="px-4 py-3">
                                    {formatarData(item.dataCriacao)}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
