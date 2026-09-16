import { Produto } from "../types/produto.types";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";

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
        <div className="painel-card overflow-hidden">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-[#f7faf8] text-muted">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Foto</th>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">Valor</th>
                        <th className="px-4 py-3 text-left font-semibold">Categoria</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border text-navy">
                    {carregando && (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted">
                                Carregando produtos...
                            </td>
                        </tr>
                    )}

                    {!carregando && produtos.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-10 text-center text-muted">
                                Nenhum produto cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        produtos.map((produto) => (
                            <tr key={produto.id} className="hover:bg-[#f7faf8]">
                                <td className="px-4 py-3">
                                    {urlPublicaArquivo(produto.urlImagem) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={urlPublicaArquivo(produto.urlImagem) ?? ""}
                                            alt=""
                                            className="h-12 w-12 rounded-xl border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border text-[10px] text-muted">
                                            —
                                        </div>
                                    )}
                                </td>
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
                                        className="btn-secundario text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(produto)}
                                        disabled={excluindoId === produto.id}
                                        className="btn-perigo ml-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
