export function urlPublicaArquivo(caminhoRelativo: string | null | undefined): string | null {
    if (!caminhoRelativo) {
        return null;
    }
    if (caminhoRelativo.startsWith("http://") || caminhoRelativo.startsWith("https://")) {
        return caminhoRelativo;
    }
    const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
    return `${base}${caminhoRelativo.startsWith("/") ? "" : "/"}${caminhoRelativo}`;
}
