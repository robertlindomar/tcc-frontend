export const PREFIXO_PAYLOAD_QR_MISSAO = "tcc://missao/";

export function montarPayloadQrMissao(tokenQr: string): string {
    return `${PREFIXO_PAYLOAD_QR_MISSAO}${tokenQr}`;
}

export function extrairTokenQrMissao(entrada: string): string {
    const trim = entrada.trim();
    if (trim.startsWith(PREFIXO_PAYLOAD_QR_MISSAO)) {
        return trim.slice(PREFIXO_PAYLOAD_QR_MISSAO.length).trim();
    }
    return trim;
}
