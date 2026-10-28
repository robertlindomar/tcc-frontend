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
