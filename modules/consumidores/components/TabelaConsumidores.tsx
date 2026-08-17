import { VisitanteLoja } from "../types/consumidor.types";

interface TabelaConsumidoresProps {
    consumidores: VisitanteLoja[];
    carregando?: boolean;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function rotuloVisitas(quantidade: number) {
    return quantidade === 1 ? "1 visita" : `${quantidade} visitas`;
}

export function TabelaConsumidores({
    consumidores,
    carregando = false,
}: TabelaConsumidoresProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Consumidor</th>
                        <th className="px-4 py-3 text-left font-semibold">Visitas</th>
                        <th className="px-4 py-3 text-left font-semibold">Última visita</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                Carregando visitantes...
                            </td>
                        </tr>
                    )}

                    {!carregando && consumidores.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                <p className="font-medium text-slate-700">
                                    Nenhuma visita registrada ainda.
                                </p>
                                <p className="mx-auto mt-2 max-w-md">
                                    Quando consumidores escanearem o QR &quot;Visitar loja&quot;,
                                    eles aparecerão aqui.
                                </p>
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        consumidores.map((consumidor) => (
                            <tr key={consumidor.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{consumidor.nome}</td>
                                <td className="px-4 py-3">
                                    {rotuloVisitas(consumidor.quantidadeVisitas)}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(consumidor.ultimaVisita)}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
