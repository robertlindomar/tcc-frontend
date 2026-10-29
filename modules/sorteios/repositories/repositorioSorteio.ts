import { Sorteio } from "../types/sorteio.types";

export interface RepositorioSorteio {
    listar(): Promise<Sorteio[]>;
    buscarPorId(id: number): Promise<Sorteio | null>;
    sortear(id: number): Promise<Sorteio>;
    refazer(id: number): Promise<Sorteio>;
    confirmarEntrega(id: number): Promise<Sorteio>;
}
