import { repositorioSexo } from "../repositories";

/** Catálogo via GET /sexo (seed: Masculino, Feminino). Sem CRUD visual. */
export async function listarSexos() {
    return repositorioSexo.listar();
}
