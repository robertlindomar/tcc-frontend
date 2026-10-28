/** Remove acentos, caixa e espaços extras para comparação de buscas. */
export function normalizarTextoBusca(valor: string | null | undefined): string {
    return (valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();
}

export function apenasDigitos(valor: string | null | undefined): string {
    return (valor ?? "").replace(/\D/g, "");
}

/**
 * Verifica se o termo corresponde a algum dos campos de texto (ignorando
 * acentos, caixa e ordem das palavras) ou a algum documento (ignorando
 * pontuação, ex.: CNPJ com ou sem máscara).
 */
export function correspondeBusca(
    termo: string,
    campos: {
        textos?: Array<string | null | undefined>;
        documentos?: Array<string | null | undefined>;
    },
): boolean {
    const termoNormalizado = normalizarTextoBusca(termo);
    if (!termoNormalizado) return true;

    const textos = (campos.textos ?? []).map(normalizarTextoBusca).join(" ");
    const palavras = termoNormalizado.split(" ");
    if (palavras.every((palavra) => textos.includes(palavra))) {
        return true;
    }

    const termoDigitos = apenasDigitos(termo);
    if (!termoDigitos) return false;
    return (campos.documentos ?? []).some((documento) =>
        apenasDigitos(documento).includes(termoDigitos),
    );
}

export function rotularContagem(
    quantidade: number,
    singular: string,
    plural: string,
): string {
    return `${quantidade} ${quantidade === 1 ? singular : plural}`;
}

/** Aplica a máscara de CNPJ progressivamente enquanto o usuário digita. */
export function mascararCnpj(valor: string): string {
    const digitos = apenasDigitos(valor).slice(0, 14);
    return digitos
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
}

/** Formata um CNPJ como 00.000.000/0000-00; retorna o valor original se não tiver 14 dígitos. */
export function formatarCnpj(valor: string | null | undefined): string {
    const digitos = apenasDigitos(valor);
    if (digitos.length !== 14) return valor ?? "";
    return digitos.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5",
    );
}
