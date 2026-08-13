import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelMinhaLoja } from "@/modules/lojistas/components/PainelMinhaLoja";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["LOJISTA"]}>
                    <PainelMinhaLoja />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
