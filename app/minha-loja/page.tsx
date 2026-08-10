import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelMinhaLoja } from "@/modules/lojistas/components/PainelMinhaLoja";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelMinhaLoja />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
