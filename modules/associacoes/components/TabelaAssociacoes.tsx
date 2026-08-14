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
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                            Nome fantasia
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Razão social
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">CNPJ</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-slate-500"
                            >
                                Carregando dados da associação...
                            </td>
                        </tr>
                    )}

                    {!carregando && associacoes.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-slate-500"
                            >
                                Nenhuma associação vinculada a esta conta.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        associacoes.map((associacao) => (
                            <tr key={associacao.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium">
                                    {associacao.nomeFantasia}
                                </td>
                                <td className="px-4 py-3">{associacao.razaoSocial}</td>
                                <td className="px-4 py-3">{associacao.cnpj}</td>
                                <td className="px-4 py-3">
                                    {formatarData(associacao.dataCriacao)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onEditar(associacao)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
