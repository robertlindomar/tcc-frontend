import { Evento } from "../types/evento.types";
import { urlPublicaArquivo } from "@/shared/utils/urlPublicaArquivo";

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
        <div className="painel-card overflow-hidden">
            <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-[#f7faf8] text-muted">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Imagem</th>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border text-navy">
                    {carregando && (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-muted">
                                Carregando eventos...
                            </td>
                        </tr>
                    )}

                    {!carregando && eventos.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-muted">
                                Nenhum evento cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        eventos.map((evento) => (
                            <tr key={evento.id} className="hover:bg-[#f7faf8]">
                                <td className="px-4 py-3">
                                    {urlPublicaArquivo(evento.urlImagem) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={urlPublicaArquivo(evento.urlImagem) ?? ""}
                                            alt=""
                                            className="h-12 w-12 rounded-xl border border-border object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-border text-[10px] text-muted">
                                            —
                                        </div>
                                    )}
                                </td>
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
                                        className="btn-secundario text-sm"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(evento)}
                                        disabled={excluindoId === evento.id}
                                        className="btn-perigo ml-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
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
