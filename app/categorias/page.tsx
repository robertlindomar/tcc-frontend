import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudCategorias } from "@/modules/categorias/components/CrudCategorias";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudCategorias />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
