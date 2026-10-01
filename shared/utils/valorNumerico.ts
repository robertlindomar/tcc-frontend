const MAXIMO_DIGITOS_MOEDA = 11;

function formatarCentavos(centavos: number): string {
    const inteiro = Math.floor(centavos / 100)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const decimais = (centavos % 100).toString().padStart(2, "0");
    return `R$${inteiro},${decimais}`;
}

/** Máscara de reais: cada dígito digitado entra pela direita como centavo (ex.: "R$1.000,98"). */
export function mascararMoeda(entrada: string): string {
    const digitos = entrada.replace(/\D/g, "").slice(0, MAXIMO_DIGITOS_MOEDA);
    if (!digitos) {
        return "";
    }
    return formatarCentavos(Number(digitos));
}

export function formatarMoeda(valor: number): string {
    return formatarCentavos(Math.round(valor * 100));
}

const MAXIMO_DIGITOS_DIAS = 3;

export function formatarDias(dias: number): string {
    return `${dias} ${dias === 1 ? "Dia" : "Dias"}`;
}

/**
 * Máscara de dias ("1 Dia", "7 Dias"). Recebe o texto anterior para que o
 * Backspace sobre o sufixo apague o último dígito em vez de não ter efeito.
 */
export function mascararDias(entrada: string, anterior: string): string {
    let digitos = entrada.replace(/\D/g, "");
    const digitosAnteriores = anterior.replace(/\D/g, "");

    if (entrada.length < anterior.length && digitos === digitosAnteriores) {
        digitos = digitos.slice(0, -1);
    }

    digitos = digitos.replace(/^0+/, "").slice(0, MAXIMO_DIGITOS_DIAS);
    return digitos ? formatarDias(Number(digitos)) : "";
}

export function converterDiasParaNumero(texto: string): number | undefined {
    const digitos = texto.replace(/\D/g, "");
    return digitos ? Number(digitos) : undefined;
}

export function converterMoedaParaNumero(texto: string): number | undefined {
    const digitos = texto.replace(/\D/g, "");
    if (!digitos) {
        return undefined;
    }
    return Number(digitos) / 100;
}
