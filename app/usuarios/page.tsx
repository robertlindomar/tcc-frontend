import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudUsuarios } from "@/modules/usuarios/components/CrudUsuarios";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudUsuarios />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
