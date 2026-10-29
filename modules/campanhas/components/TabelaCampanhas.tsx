import { MouseEvent } from "react";
import { formatarMoeda } from "@/shared/utils/valorNumerico";
import { Campanha } from "../types/campanha.types";
import { formatarCivilBr, rotuloStatusCampanha } from "../utils/campanhaEdicao";

interface TabelaCampanhasProps {
    campanhas: Campanha[];
    onAbrir: (campanha: Campanha) => void;
    onEditar: (campanha: Campanha) => void;
    onExcluir: (campanha: Campanha) => void;
    carregando?: boolean;
    excluindoId?: number | null;
    mensagemVazia?: string;
}

const CLASSE_STATUS: Record<string, string> = {
    Ativa: "bg-emerald-50 text-emerald-700",
    Encerrada: "bg-amber-50 text-amber-700",
    Inativa: "bg-slate-100 text-slate-600",
};

const COLUNAS = 7;

export function TabelaCampanhas({
    campanhas,
    onAbrir,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
    mensagemVazia = "Nenhuma campanha cadastrada.",
}: TabelaCampanhasProps) {
    function semAbrir(acao: () => void) {
        return (event: MouseEvent) => {
            event.stopPropagation();
            acao();
        };
    }

    return (
        <div className="painel-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-sm">
                    <thead className="bg-[#f7faf8] text-navy">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">Nome</th>
                            <th className="px-5 py-3 text-left font-semibold">Status</th>
                            <th className="px-5 py-3 text-left font-semibold">Edição</th>
                            <th className="px-5 py-3 text-left font-semibold">Tickets</th>
                            <th className="px-5 py-3 text-left font-semibold">Período</th>
                            <th className="px-5 py-3 text-left font-semibold">Valor</th>
                            <th className="px-5 py-3 text-right font-semibold">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border text-navy">
                        {carregando ? (
                            <tr>
                                <td colSpan={COLUNAS} className="px-5 py-10 text-center text-muted">
                                    Carregando campanhas...
                                </td>
                            </tr>
                        ) : null}

                        {!carregando && campanhas.length === 0 ? (
                            <tr>
                                <td colSpan={COLUNAS} className="px-5 py-10 text-center text-muted">
                                    {mensagemVazia}
                                </td>
                            </tr>
                        ) : null}

                        {!carregando &&
                            campanhas.map((campanha) => {
                                const status = rotuloStatusCampanha(campanha);
                                return (
                                    <tr
                                        key={campanha.id}
                                        onClick={() => onAbrir(campanha)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") onAbrir(campanha);
                                        }}
                                        tabIndex={0}
                                        aria-label={`Abrir campanha ${campanha.nome}`}
                                        className="cursor-pointer hover:bg-[#f7faf8]/80 focus:bg-[#f7faf8] focus:outline-none"
                                    >
                                        <td className="px-5 py-3.5 font-semibold">{campanha.nome}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CLASSE_STATUS[status]}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">{campanha.edicao}</td>
                                        <td className="px-5 py-3.5">{campanha.totalTickets}</td>
                                        <td className="px-5 py-3.5">
                                            {formatarCivilBr(campanha.dataInicioCivil)} —{" "}
                                            {formatarCivilBr(campanha.dataFimCivil)}
                                        </td>
                                        <td className="px-5 py-3.5">{formatarMoeda(campanha.valorPorTicket)}</td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                                            <button
                                                type="button"
                                                onClick={semAbrir(() => onEditar(campanha))}
                                                className="btn-secundario px-3 py-1.5 text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={semAbrir(() => onExcluir(campanha))}
                                                disabled={excluindoId === campanha.id}
                                                className="btn-perigo ml-2 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {excluindoId === campanha.id ? "Excluindo..." : "Excluir"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
