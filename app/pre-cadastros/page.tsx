import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelPreCadastros } from "@/modules/lojistas/components/PainelPreCadastros";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelPreCadastros />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
