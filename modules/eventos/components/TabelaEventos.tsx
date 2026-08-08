import { Evento } from "../types/evento.types";

interface TabelaEventosProps {
    eventos: Evento[];
    onEditar: (evento: Evento) => void;
    onExcluir: (evento: Evento) => void;
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

export function TabelaEventos({
    eventos,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaEventosProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                Carregando eventos...
                            </td>
                        </tr>
                    )}

                    {!carregando && eventos.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                Nenhum evento cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        eventos.map((evento) => (
                            <tr key={evento.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{evento.nome}</td>
                                <td className="px-4 py-3">
                                    {evento.descricao ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(evento.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(evento)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(evento)}
                                        disabled={excluindoId === evento.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === evento.id
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
