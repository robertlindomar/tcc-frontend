import { Promocao } from "../types/promocao.types";

interface TabelaPromocoesProps {
    promocoes: Promocao[];
    nomeProdutoPorId: Record<number, string>;
    onEditar: (promocao: Promocao) => void;
    onExcluir: (promocao: Promocao) => void;
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

function formatarPreco(preco: number) {
    return preco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function TabelaPromocoes({
    promocoes,
    nomeProdutoPorId,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaPromocoesProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Produto</th>
                        <th className="px-4 py-3 text-left font-semibold">Preço</th>
                        <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Carregando promoções...
                            </td>
                        </tr>
                    )}

                    {!carregando && promocoes.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhuma promoção cadastrada.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        promocoes.map((promocao) => (
                            <tr key={promocao.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">
                                    {nomeProdutoPorId[promocao.produtoId] ??
                                        `#${promocao.produtoId}`}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarPreco(promocao.preco)}
                                </td>
                                <td className="px-4 py-3">
                                    {promocao.descricao ?? "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(promocao.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(promocao)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(promocao)}
                                        disabled={excluindoId === promocao.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === promocao.id
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
