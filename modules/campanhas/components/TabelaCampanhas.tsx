import { Campanha } from "../types/campanha.types";

interface TabelaCampanhasProps {
    campanhas: Campanha[];
    onEditar: (campanha: Campanha) => void;
    onExcluir: (campanha: Campanha) => void;
    carregando?: boolean;
    excluindoId?: number | null;
}

function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarCivilBr(civil: string) {
    const [ano, mes, dia] = civil.split("-");
    if (!ano || !mes || !dia) {
        return civil;
    }
    return `${dia}/${mes}/${ano}`;
}

export function TabelaCampanhas({
    campanhas,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaCampanhasProps) {
    return (
        <div className="painel-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-sm">
                    <thead className="bg-[#f7faf8] text-navy">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">Nome</th>
                            <th className="px-5 py-3 text-left font-semibold">Vigência</th>
                            <th className="px-5 py-3 text-left font-semibold">
                                R$ / ticket
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Descrição
                            </th>
                            <th className="px-5 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border text-navy">
                        {carregando ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Carregando campanhas...
                                </td>
                            </tr>
                        ) : null}

                        {!carregando && campanhas.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Nenhuma campanha cadastrada.
                                </td>
                            </tr>
                        ) : null}

                        {!carregando &&
                            campanhas.map((campanha) => (
                                <tr
                                    key={campanha.id}
                                    className="hover:bg-[#f7faf8]/80"
                                >
                                    <td className="px-5 py-3.5 font-semibold">
                                        {campanha.nome}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {formatarCivilBr(campanha.dataInicioCivil)} —{" "}
                                        {formatarCivilBr(campanha.dataFimCivil)}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {formatarMoeda(campanha.valorPorTicket)}
                                    </td>
                                    <td className="px-5 py-3.5 text-muted">
                                        {campanha.descricao ?? "—"}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onEditar(campanha)}
                                            className="btn-secundario px-3 py-1.5 text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onExcluir(campanha)}
                                            disabled={excluindoId === campanha.id}
                                            className="btn-perigo ml-2 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {excluindoId === campanha.id
                                                ? "Excluindo..."
                                                : "Excluir"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
