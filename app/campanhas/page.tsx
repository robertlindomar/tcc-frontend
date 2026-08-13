import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudCampanhas } from "@/modules/campanhas/components/CrudCampanhas";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["ASSOCIACAO"]}>
                    <CrudCampanhas />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
