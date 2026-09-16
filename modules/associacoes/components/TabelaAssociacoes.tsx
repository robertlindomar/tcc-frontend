import { Associacao } from "../types/associacao.types";

interface TabelaAssociacoesProps {
    associacoes: Associacao[];
    onEditar: (associacao: Associacao) => void;
    carregando?: boolean;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function TabelaAssociacoes({
    associacoes,
    onEditar,
    carregando = false,
}: TabelaAssociacoesProps) {
    return (
        <div className="painel-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead className="bg-[#f7faf8] text-navy">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">
                                Nome fantasia
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Razão social
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">CNPJ</th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Criação
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
                                    Carregando dados da associação...
                                </td>
                            </tr>
                        ) : null}

                        {!carregando && associacoes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Nenhuma associação vinculada a esta conta.
                                </td>
                            </tr>
                        ) : null}

                        {!carregando &&
                            associacoes.map((associacao) => (
                                <tr
                                    key={associacao.id}
                                    className="hover:bg-[#f7faf8]/80"
                                >
                                    <td className="px-5 py-3.5 font-semibold">
                                        {associacao.nomeFantasia}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        {associacao.razaoSocial}
                                    </td>
                                    <td className="px-5 py-3.5">{associacao.cnpj}</td>
                                    <td className="px-5 py-3.5">
                                        {formatarData(associacao.dataCriacao)}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onEditar(associacao)}
                                            className="btn-secundario px-3 py-1.5 text-sm"
                                        >
                                            Editar
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
