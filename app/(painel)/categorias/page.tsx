import { CrudCategorias } from "@/modules/categorias/components/CrudCategorias";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="as categorias">
            <CrudCategorias />
        </ExigirLojaAprovada>
    );
}
