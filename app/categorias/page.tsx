import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudCategorias } from "@/modules/categorias/components/CrudCategorias";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="as categorias">
                    <CrudCategorias />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
