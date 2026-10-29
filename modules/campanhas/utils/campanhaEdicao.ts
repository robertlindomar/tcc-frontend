/**
 * Regras de exibição da campanha por edição (status, sorteio e ações do modal).
 * Sem dependências de React/axios para poder ser testado com `node --test`.
 */

export type SituacaoSorteioEdicao =
    | "AGUARDANDO_ENCERRAMENTO"
    | "PRONTO_PARA_SORTEAR"
    | "SEM_TICKETS"
    | "AGUARDANDO_ENTREGA"
    | "ENTREGUE";

export interface EstadoCampanhaEdicao {
    ativa: boolean;
    periodoEncerrado: boolean;
    situacaoSorteio: SituacaoSorteioEdicao;
    dataFimCivil: string;
}

export const ROTULO_SITUACAO_SORTEIO: Record<SituacaoSorteioEdicao, string> = {
    AGUARDANDO_ENCERRAMENTO: "Aguardando fim do período",
    PRONTO_PARA_SORTEAR: "Pronto para sortear",
    SEM_TICKETS: "Sem tickets",
    AGUARDANDO_ENTREGA: "Aguardando entrega",
    ENTREGUE: "Prêmio entregue",
};

/** Mensagens específicas por `codigo` devolvido pela API de campanha/sorteio. */
export const MENSAGENS_ERRO_CAMPANHA: Record<string, string> = {
    CAMPANHA_NOME_DUPLICADO: "Já existe uma campanha com esse nome. Reative a campanha existente ou escolha outro nome.",
    CAMPANHA_PERIODO_OCUPADO: "Já existe outra campanha ativa nesse período. Escolha datas que não se sobreponham.",
    CAMPANHA_EDICAO_EM_USO: "Esta edição já recebeu notas fiscais: período e valor por ticket não podem mais ser alterados.",
    CAMPANHA_JA_ATIVA: "A campanha já está ativa. Inative-a antes de abrir uma nova edição.",
    CAMPANHA_AINDA_VIGENTE: "A edição atual ainda não terminou. Aguarde o fim do período para reativar.",
    SORTEIO_PENDENTE: "Realize o sorteio da edição atual antes de abrir uma nova edição.",
    OPERACAO_CONCORRENTE: "A campanha foi alterada por outra operação. Atualize a página e tente novamente.",
    CAMPANHA_COM_TICKETS: "A campanha possui tickets e não pode ser excluída. Inative-a para preservar o histórico.",
    CAMPANHA_COM_HISTORICO: "A campanha possui histórico (notas ou sorteios) e não pode ser excluída. Inative-a.",
    CAMPANHA_NAO_ENCERRADA: "O sorteio só pode ser feito depois do fim do período da edição.",
    SEM_TICKETS: "Esta edição não tem tickets para sortear.",
    SORTEIO_JA_REALIZADO: "O sorteio desta edição já foi realizado.",
    TICKET_EDICAO_INVALIDA: "O ticket sorteado não pertence a esta edição. Atualize e tente novamente.",
};

export function mensagemErroCampanha(codigo: string | null | undefined): string | null {
    return codigo ? MENSAGENS_ERRO_CAMPANHA[codigo] ?? null : null;
}

export type CampoFormCampanha = "nome" | "periodo" | "valor";

const CAMPO_POR_CODIGO: Record<string, CampoFormCampanha> = {
    CAMPANHA_NOME_DUPLICADO: "nome",
    CAMPANHA_PERIODO_OCUPADO: "periodo",
    CAMPANHA_EDICAO_EM_USO: "periodo",
    CAMPANHA_AINDA_VIGENTE: "periodo",
};

/** Campo do formulário ao qual o erro da API se refere (null = erro geral). */
export function campoDoErroCampanha(codigo: string | null | undefined): CampoFormCampanha | null {
    return codigo ? CAMPO_POR_CODIGO[codigo] ?? null : null;
}

/** Códigos em que a exclusão pode seguir com uma segunda confirmação (definitiva). */
export const CODIGOS_EXCLUSAO_COM_HISTORICO = ["CAMPANHA_COM_TICKETS", "CAMPANHA_COM_HISTORICO"];

export interface HistoricoExclusao {
    totalTickets: number;
    totalNotas: number;
    totalResultados: number;
}

function plural(total: number, singular: string, pluralTexto: string): string {
    return `${total} ${total === 1 ? singular : pluralTexto}`;
}

/** Itens que serão apagados junto com a campanha, para o aviso de risco. */
export function descreverRiscoExclusao(historico: HistoricoExclusao): string[] {
    const itens: string[] = [];
    if (historico.totalTickets > 0) {
        itens.push(`${plural(historico.totalTickets, "ticket", "tickets")} dos consumidores`);
    }
    if (historico.totalNotas > 0) {
        itens.push(plural(historico.totalNotas, "nota fiscal registrada", "notas fiscais registradas"));
    }
    if (historico.totalResultados > 0) {
        itens.push(`${plural(historico.totalResultados, "resultado de sorteio", "resultados de sorteio")} (vencedores e avisos no app)`);
    }
    return itens;
}

/** `YYYY-MM-DD` → `dd/mm/aaaa`. */
export function formatarCivilBr(civil: string): string {
    const [ano, mes, dia] = civil.split("-");
    if (!ano || !mes || !dia) {
        return civil;
    }
    return `${dia}/${mes}/${ano}`;
}

export function rotuloStatusCampanha(campanha: Pick<EstadoCampanhaEdicao, "ativa" | "periodoEncerrado">): string {
    if (!campanha.ativa) {
        return "Inativa";
    }
    return campanha.periodoEncerrado ? "Encerrada" : "Ativa";
}

export interface AcoesCampanha {
    podeSortear: boolean;
    /** Motivo exibido quando o sorteio está indisponível (null = sem aviso). */
    motivoSortear: string | null;
    podeInativar: boolean;
    podeReativar: boolean;
    motivoReativar: string | null;
}

/** Espelha as regras do backend para habilitar/desabilitar ações do modal. */
export function acoesCampanha(estado: EstadoCampanhaEdicao): AcoesCampanha {
    const podeSortear = estado.situacaoSorteio === "PRONTO_PARA_SORTEAR";
    let motivoSortear: string | null = null;
    if (estado.situacaoSorteio === "AGUARDANDO_ENCERRAMENTO") {
        motivoSortear = `Disponível após ${formatarCivilBr(estado.dataFimCivil)}`;
    } else if (estado.situacaoSorteio === "SEM_TICKETS") {
        motivoSortear = "Sem tickets para sortear";
    }

    let motivoReativar: string | null = null;
    if (estado.ativa) {
        motivoReativar = "Inative a campanha para abrir uma nova edição.";
    } else if (!estado.periodoEncerrado) {
        motivoReativar = `A edição atual termina em ${formatarCivilBr(estado.dataFimCivil)}.`;
    } else if (estado.situacaoSorteio === "PRONTO_PARA_SORTEAR") {
        motivoReativar = "Realize o sorteio desta edição antes de reativar.";
    }

    return {
        podeSortear,
        motivoSortear,
        podeInativar: estado.ativa,
        podeReativar: motivoReativar === null,
        motivoReativar,
    };
}
