import { Produto } from "../types/produto.types";

interface TabelaProdutosProps {
    produtos: Produto[];
    nomeCategoriaPorId?: Map<number, string>;
    onEditar: (produto: Produto) => void;
    onExcluir: (produto: Produto) => void;
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

function formatarValor(valor: number) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function TabelaProdutos({
    produtos,
    nomeCategoriaPorId,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaProdutosProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">Valor</th>
                        <th className="px-4 py-3 text-left font-semibold">Categoria</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Carregando produtos...
                            </td>
                        </tr>
                    )}

                    {!carregando && produtos.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhum produto cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        produtos.map((produto) => (
                            <tr key={produto.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">{produto.nome}</td>
                                <td className="px-4 py-3">{formatarValor(produto.valor)}</td>
                                <td className="px-4 py-3">
                                    {produto.categoriaId != null
                                        ? (nomeCategoriaPorId?.get(produto.categoriaId) ??
                                          `#${produto.categoriaId}`)
                                        : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(produto.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(produto)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(produto)}
                                        disabled={excluindoId === produto.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === produto.id
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
