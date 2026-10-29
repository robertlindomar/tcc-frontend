/** Fuso civil de negócio, o mesmo usado pelo backend para validar datas. */
const FUSO_NEGOCIO = "America/Sao_Paulo";

/** Maior data aceita em `<input type="date">`; impede anos com mais de 4 dígitos. */
export const DATA_MAXIMA_INPUT = "9999-12-31";

/** Data de hoje no fuso de negócio, no formato YYYY-MM-DD. */
export function hojeIsoCivil(agora: Date = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: FUSO_NEGOCIO,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(agora);
}

/**
 * Menor data aceita: hoje, ou a data já salva quando ela é anterior a hoje
 * (permite editar um item vencido sem trocar a data).
 */
export function dataMinimaPermitida(
    valorOriginal?: string | null,
    agora: Date = new Date(),
): string {
    const hoje = hojeIsoCivil(agora);
    return valorOriginal && valorOriginal < hoje ? valorOriginal : hoje;
}

/** Retorna a mensagem de erro da data, ou `null` se ela for válida. */
export function validarDataNaoPassada(
    valor: string,
    opcoes: {
        rotulo: string;
        obrigatorio?: boolean;
        valorOriginal?: string | null;
        agora?: Date;
    },
): string | null {
    if (!valor) {
        return opcoes.obrigatorio ? `Informe a data de ${opcoes.rotulo}.` : null;
    }
    if (!ehDataIsoValida(valor)) {
        return `Data de ${opcoes.rotulo} inválida. Use dd/mm/aaaa, com ano de 4 dígitos.`;
    }
    const alterada = valor !== opcoes.valorOriginal;
    if (alterada && valor < hojeIsoCivil(opcoes.agora)) {
        return `A data de ${opcoes.rotulo} não pode ser anterior a hoje.`;
    }
    return null;
}

/** `YYYY-MM-DD` → `dd/mm/aaaa` (vazio se o valor não tiver esse formato). */
export function isoParaBr(iso: string): string {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
}

/** Máscara de digitação `dd/mm/aaaa` (só dígitos, no máximo 8). */
export function mascararDataBr(texto: string): string {
    const digitos = texto.replace(/\D/g, "").slice(0, 8);
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
    return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

/** `dd/mm/aaaa` completo → `YYYY-MM-DD` (sem validar o dia); `null` se incompleto. */
export function brParaIso(texto: string): string | null {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

export interface DiaCalendario {
    iso: string;
    dia: number;
    doMes: boolean;
}

/** Grade de 6 semanas (domingo a sábado) do mês `YYYY-MM`. */
export function montarGradeMes(anoMes: string): DiaCalendario[] {
    const [ano, mes] = anoMes.split("-").map(Number);
    const primeiro = new Date(Date.UTC(ano, mes - 1, 1));
    const inicio = new Date(primeiro);
    inicio.setUTCDate(1 - primeiro.getUTCDay());
    return Array.from({ length: 42 }, (_, indice) => {
        const data = new Date(inicio);
        data.setUTCDate(inicio.getUTCDate() + indice);
        return {
            iso: data.toISOString().slice(0, 10),
            dia: data.getUTCDate(),
            doMes: data.getUTCMonth() === mes - 1,
        };
    });
}

/** Soma meses a `YYYY-MM`. */
export function somarMeses(anoMes: string, meses: number): string {
    const [ano, mes] = anoMes.split("-").map(Number);
    const data = new Date(Date.UTC(ano, mes - 1 + meses, 1));
    return data.toISOString().slice(0, 7);
}

/** Verifica se o valor é uma data YYYY-MM-DD existente, com ano de 4 dígitos. */
export function ehDataIsoValida(valor: string): boolean {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (!match) return false;
    const [ano, mes, dia] = match.slice(1).map(Number);
    const data = new Date(Date.UTC(ano, mes - 1, dia));
    return (
        data.getUTCFullYear() === ano &&
        data.getUTCMonth() === mes - 1 &&
        data.getUTCDate() === dia
    );
}
