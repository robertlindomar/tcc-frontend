import { Sorteio } from "../types/sorteio.types";

interface TabelaSorteiosProps {
    sorteios: Sorteio[];
    nomeCampanhaPorId: Record<number, string>;
    onEditar: (sorteio: Sorteio) => void;
    onExcluir: (sorteio: Sorteio) => void;
    onAbrirResultado: (sorteio: Sorteio) => void;
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

function descreverSituacao(sorteio: Sorteio) {
    const atual = sorteio.resultadoAtual;
    if (atual?.situacao === "ENTREGUE") {
        return `Prêmio entregue (#${atual.numeroSorteado})`;
    }
    if (atual?.situacao === "AGUARDANDO_ENTREGA") {
        return `Aguardando entrega (#${atual.numeroSorteado})`;
    }
    return sorteio.campanhaEncerrada ? "Pronto para sortear" : "Campanha em andamento";
}

export function TabelaSorteios({
    sorteios,
    nomeCampanhaPorId,
    onEditar,
    onExcluir,
    onAbrirResultado,
    carregando = false,
    excluindoId = null,
}: TabelaSorteiosProps) {
    return (
        <div className="painel-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px] text-sm">
                    <thead className="bg-[#f7faf8] text-navy">
                        <tr>
                            <th className="px-5 py-3 text-left font-semibold">
                                Campanha
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                QR Code
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Tickets
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Situação
                            </th>
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
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Carregando sorteios...
                                </td>
                            </tr>
                        ) : null}

                        {!carregando && sorteios.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-5 py-10 text-center text-muted"
                                >
                                    Nenhum sorteio cadastrado.
                                </td>
                            </tr>
                        ) : null}

                        {!carregando &&
                            sorteios.map((sorteio) => {
                                const realizado = sorteio.historico.length > 0;
                                return (
                                    <tr
                                        key={sorteio.id}
                                        className="hover:bg-[#f7faf8]/80"
                                    >
                                        <td className="px-5 py-3.5 font-semibold">
                                            {nomeCampanhaPorId[sorteio.campanhaId] ??
                                                `#${sorteio.campanhaId}`}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {sorteio.qrcode ?? "—"}
                                        </td>
                                        <td className="px-5 py-3.5">{sorteio.totalTickets}</td>
                                        <td className="px-5 py-3.5">
                                            {descreverSituacao(sorteio)}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {formatarData(sorteio.dataCriacao)}
                                        </td>
                                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                                            <button
                                                type="button"
                                                onClick={() => onAbrirResultado(sorteio)}
                                                className="btn-primario px-3 py-1.5 text-sm"
                                            >
                                                {sorteio.resultadoAtual ? "Ver resultado" : "Sortear"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEditar(sorteio)}
                                                className="btn-secundario ml-2 px-3 py-1.5 text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onExcluir(sorteio)}
                                                disabled={realizado || excluindoId === sorteio.id}
                                                title={
                                                    realizado
                                                        ? "Sorteio já realizado não pode ser excluído"
                                                        : undefined
                                                }
                                                className="btn-perigo ml-2 px-3 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {excluindoId === sorteio.id
                                                    ? "Excluindo..."
                                                    : "Excluir"}
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
