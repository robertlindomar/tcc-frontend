import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudMissoes } from "@/modules/missoes/components/CrudMissoes";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudMissoes />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
