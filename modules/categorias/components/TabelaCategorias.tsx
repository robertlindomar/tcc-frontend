import { Categoria } from "../types/categoria.types";

interface TabelaCategoriasProps {
    categorias: Categoria[];
    onEditar: (categoria: Categoria) => void;
    onExcluir: (categoria: Categoria) => void;
    carregando?: boolean;
    excluindoId?: number | null;
}

export function TabelaCategorias({
    categorias,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaCategoriasProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando ? (
                        <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                Carregando categorias...
                            </td>
                        </tr>
                    ) : null}
                    {!carregando && categorias.length === 0 ? (
                        <tr>
                            <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                Nenhuma categoria cadastrada.
                            </td>
                        </tr>
                    ) : null}
                    {!carregando
                        ? categorias.map((categoria) => (
                              <tr key={categoria.id} className="hover:bg-slate-50">
                                  <td className="px-4 py-3 font-medium">{categoria.nome}</td>
                                  <td className="px-4 py-3 text-right">
                                      <button
                                          type="button"
                                          onClick={() => onEditar(categoria)}
                                          className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                      >
                                          Editar
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => onExcluir(categoria)}
                                          disabled={excluindoId === categoria.id}
                                          className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                          {excluindoId === categoria.id
                                              ? "Excluindo..."
                                              : "Excluir"}
                                      </button>
                                  </td>
                              </tr>
                          ))
                        : null}
                </tbody>
            </table>
        </div>
    );
}
