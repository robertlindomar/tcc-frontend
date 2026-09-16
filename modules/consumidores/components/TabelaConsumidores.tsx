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
        <div className="painel-card overflow-hidden">
            <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-[#f7faf8] text-muted">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Consumidor</th>
                        <th className="px-4 py-3 text-left font-semibold">Visitas</th>
                        <th className="px-4 py-3 text-left font-semibold">Última visita</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border text-navy">
                    {carregando && (
                        <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-muted">
                                Carregando visitantes...
                            </td>
                        </tr>
                    )}

                    {!carregando && consumidores.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-4 py-10 text-center text-muted">
                                <p className="font-medium text-navy">
                                    Nenhuma visita registrada ainda.
                                </p>
                                <p className="mx-auto mt-2 max-w-md text-muted">
                                    Quando consumidores escanearem o QR &quot;Visitar loja&quot;,
                                    eles aparecerão aqui.
                                </p>
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        consumidores.map((consumidor) => (
                            <tr key={consumidor.id} className="hover:bg-[#f7faf8]">
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
