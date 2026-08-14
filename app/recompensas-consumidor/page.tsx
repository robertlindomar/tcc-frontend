import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelRecompensasConsumidor } from "@/modules/recompensas/components/PainelRecompensasConsumidor";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["CONSUMIDOR"]}>
                    <PainelRecompensasConsumidor />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
