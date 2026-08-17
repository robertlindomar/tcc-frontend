export type FrequenciaMissao = "UMA_VEZ" | "DIARIA" | "SEMANAL" | "MENSAL";

export const ROTULOS_FREQUENCIA_MISSAO: Record<FrequenciaMissao, string> = {
    UMA_VEZ: "Apenas uma vez",
    DIARIA: "Uma vez por dia",
    SEMANAL: "Uma vez por semana",
    MENSAL: "Uma vez por mês",
};

export function rotuloFrequenciaMissao(frequencia: FrequenciaMissao): string {
    return ROTULOS_FREQUENCIA_MISSAO[frequencia];
}

export function formatarDataCivilBr(dataCivil: string | null): string {
    if (!dataCivil) {
        return "Sem validade";
    }
    const [ano, mes, dia] = dataCivil.split("-");
    if (!ano || !mes || !dia) {
        return dataCivil;
    }
    return `${dia}/${mes}/${ano}`;
}
