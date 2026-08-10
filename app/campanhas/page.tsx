import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudCampanhas } from "@/modules/campanhas/components/CrudCampanhas";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudCampanhas />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
