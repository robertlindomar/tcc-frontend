import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelCategorias } from "@/modules/categorias/components/PainelCategorias";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelCategorias />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
