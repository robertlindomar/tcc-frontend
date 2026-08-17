import { Missao } from "../types/missao.types";
import {
    formatarDataCivilBr,
    rotuloFrequenciaMissao,
} from "../utils/rotulosMissao";

interface TabelaMissoesProps {
    missoes: Missao[];
    onEditar: (missao: Missao) => void;
    onExcluir: (missao: Missao) => void;
    onVerQr: (missao: Missao) => void;
    carregando?: boolean;
    excluindoId?: number | null;
}

export function TabelaMissoes({
    missoes,
    onEditar,
    onExcluir,
    onVerQr,
    carregando = false,
    excluindoId = null,
}: TabelaMissoesProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Missão</th>
                        <th className="px-4 py-3 text-left font-semibold">Pontos</th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Frequência
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                            Válida até
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Carregando missões...
                            </td>
                        </tr>
                    )}

                    {!carregando && missoes.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                Nenhuma missão cadastrada.
                            </td>
                        </tr>
                    )}

                    {!carregando &&
                        missoes.map((missao) => (
                            <tr key={missao.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{missao.nome}</div>
                                    {missao.expirada && (
                                        <span className="mt-1 inline-block bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                                            EXPIRADA
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    +{missao.pontoRecompensa} pontos
                                </td>
                                <td className="px-4 py-3">
                                    {rotuloFrequenciaMissao(missao.frequencia)}
                                </td>
                                <td className="px-4 py-3">
                                    {formatarDataCivilBr(missao.dataFimCivil)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onVerQr(missao)}
                                        className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Ver QR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onEditar(missao)}
                                        className="ml-2 border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onExcluir(missao)}
                                        disabled={excluindoId === missao.id}
                                        className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {excluindoId === missao.id
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
