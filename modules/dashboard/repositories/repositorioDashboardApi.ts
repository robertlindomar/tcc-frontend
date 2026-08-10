import { clienteHttp } from "@/shared/services/clienteHttp";
import { ResumoDashboard } from "../types/dashboard.types";

export async function buscarResumoDashboardApi(): Promise<ResumoDashboard> {
    const response = await clienteHttp.get<ResumoDashboard>("/dashboard/resumo");
    return response.data;
}
