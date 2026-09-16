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
        <div className="painel-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-[#f7faf8] text-navy">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">
                                Campanha
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                QR Code
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Criação
                            </th>
                            <th className="px-5 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border text-navy">
                        {carregando ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Carregando sorteios...
                                </td>
                            </tr>
                        ) : null}

                        {!carregando && sorteios.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Nenhum sorteio cadastrado.
                                </td>
                            </tr>
                        ) : null}

                        {!carregando &&
                            sorteios.map((sorteio) => (
                                <tr
                                    key={sorteio.id}
                                    className="hover:bg-[#f7faf8]/80"
                                >
                                    <td className="px-5 py-3.5 font-semibold">
                                        {nomeCampanhaPorId[sorteio.campanhaId] ??
                                            `#${sorteio.campanhaId}`}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {sorteio.qrcode ?? "—"}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {formatarData(sorteio.dataCriacao)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onEditar(sorteio)}
                                            className="btn-secundario px-3 py-1.5 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onExcluir(sorteio)}
                                            disabled={excluindoId === sorteio.id}
                                            className="btn-perigo ml-2 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>
    );
}
