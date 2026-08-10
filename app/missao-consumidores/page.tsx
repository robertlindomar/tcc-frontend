import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelMissoesConsumidor } from "@/modules/missao-consumidores/components/PainelMissoesConsumidor";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelMissoesConsumidor />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
