import { Missao } from "../types/missao.types";

interface TabelaMissoesProps {
    missoes: Missao[];
    onEditar: (missao: Missao) => void;
    onExcluir: (missao: Missao) => void;
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

export function TabelaMissoes({
    missoes,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaMissoesProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Pontos
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Carregando missões...
                            </td>
                        </tr>
                    )}

                    {!carregando && missoes.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhuma missão cadastrada.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        missoes.map((missao) => (
                            <tr key={missao.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{missao.nome}</td>
                                <td className="px-4 py-3">{missao.pontoRecompensa}</td>
                                <td className="px-4 py-3">
                                    {missao.descricao ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(missao.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(missao)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(missao)}
                                        disabled={excluindoId === missao.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === missao.id
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
