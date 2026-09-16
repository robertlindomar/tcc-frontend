import { Promocao, StatusVigenciaPromocao } from "../types/promocao.types";

interface TabelaPromocoesProps {
    promocoes: Promocao[];
    nomeProdutoPorId: Record<number, string>;
    onEditar: (promocao: Promocao) => void;
    onDesativar: (promocao: Promocao) => void;
    onReativar: (promocao: Promocao) => void;
    onExcluir: (promocao: Promocao) => void;
    carregando?: boolean;
    excluindoId?: number | null;
    desativandoId?: number | null;
    reativandoId?: number | null;
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

function rotuloStatus(status: StatusVigenciaPromocao) {
    if (status === "ATIVA") {
        return "Ativa";
    }
    if (status === "DESATIVADA") {
        return "Desativada";
    }
    return "Expirada";
}

export function TabelaPromocoes({
    promocoes,
    nomeProdutoPorId,
    onEditar,
    onDesativar,
    onReativar,
    onExcluir,
    carregando = false,
    excluindoId = null,
    desativandoId = null,
    reativandoId = null,
}: TabelaPromocoesProps) {
    return (
        <div className="painel-card overflow-hidden">
            <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-[#f7faf8] text-muted">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Produto</th>
                        <th className="px-4 py-3 text-left font-semibold">Preço</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Válida até</th>
                        <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border text-navy">
                    {carregando && (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted">
                                Carregando promoções...
                            </td>
                        </tr>
                    )}

                    {!carregando && promocoes.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted">
                                Nenhuma promoção cadastrada.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        promocoes.map((promocao) => (
                            <tr key={promocao.id} className="hover:bg-[#f7faf8]">
                                <td className="px-4 py-3 font-medium">
                                    {nomeProdutoPorId[promocao.produtoId] ??
                                        `#${promocao.produtoId}`}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarPreco(promocao.preco)}
                                </td>
                                <td className="px-4 py-3">
                                    {rotuloStatus(promocao.statusVigencia)}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarData(promocao.dataFim)}
                                </td>
                                <td className="px-4 py-3">
                                    {promocao.descricao ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(promocao)}
                                        className="btn-secundario text-sm"
                                    >
                                        Editar
                                    </button>
                                    {promocao.ativa ? (
                                        <button
                                            type="button"
                                            onClick={() => onDesativar(promocao)}
                                            disabled={desativandoId === promocao.id}
                                            className="btn-secundario ml-2 text-sm text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {desativandoId === promocao.id
                                                ? "Desativando..."
                                                : "Desativar"}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => onReativar(promocao)}
                                            disabled={reativandoId === promocao.id}
                                            className="btn-secundario ml-2 text-sm text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {reativandoId === promocao.id
                                                ? "Reativando..."
                                                : "Reativar"}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(promocao)}
                                        disabled={excluindoId === promocao.id}
                                        className="btn-perigo ml-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
