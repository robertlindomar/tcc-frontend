import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelLojasAprovadas } from "@/modules/lojistas/components/PainelLojasAprovadas";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelLojasAprovadas />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
