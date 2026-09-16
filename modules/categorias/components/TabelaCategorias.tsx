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
        <div className="painel-card overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-[#f7faf8] text-muted">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border text-navy">
                    {carregando ? (
                        <tr>
                            <td colSpan={2} className="px-4 py-10 text-center text-muted">
                                Carregando categorias...
                            </td>
                        </tr>
                    ) : null}
                    {!carregando && categorias.length === 0 ? (
                        <tr>
                            <td colSpan={2} className="px-4 py-10 text-center text-muted">
                                Nenhuma categoria cadastrada.
                            </td>
                        </tr>
                    ) : null}
                    {!carregando
                        ? categorias.map((categoria) => (
                              <tr key={categoria.id} className="hover:bg-[#f7faf8]">
                                  <td className="px-4 py-3 font-medium">{categoria.nome}</td>
                                  <td className="px-4 py-3 text-right">
                                      <button
                                          type="button"
                                          onClick={() => onEditar(categoria)}
                                          className="btn-secundario text-sm"
                                      >
                                          Editar
                                      </button>
                                      <button
                                          type="button"
                                          onClick={() => onExcluir(categoria)}
                                          disabled={excluindoId === categoria.id}
                                          className="btn-perigo ml-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
