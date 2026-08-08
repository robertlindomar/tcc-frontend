import { Consumidor } from "../types/consumidor.types";

interface TabelaConsumidoresProps {
    consumidores: Consumidor[];
    onEditar: (consumidor: Consumidor) => void;
    onExcluir: (consumidor: Consumidor) => void;
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

export function TabelaConsumidores({
    consumidores,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaConsumidoresProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">CPF</th>
                        <th className="px-4 py-3 text-left font-semibold">Usuário</th>
                        <th className="px-4 py-3 text-left font-semibold">Pontos</th>
                        <th className="px-4 py-3 text-left font-semibold">Nível</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                Carregando consumidores...
                            </td>
                        </tr>
                    )}

                    {!carregando && consumidores.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                Nenhum consumidor cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        consumidores.map((consumidor) => (
                            <tr key={consumidor.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{consumidor.cpf}</td>
                                <td className="px-4 py-3">{consumidor.usuarioId}</td>
                                <td className="px-4 py-3">{consumidor.pontos}</td>
                                <td className="px-4 py-3">{consumidor.nivel}</td>
                                <td className="px-4 py-3">
                                    {formatarData(consumidor.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(consumidor)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(consumidor)}
                                        disabled={excluindoId === consumidor.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === consumidor.id
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
