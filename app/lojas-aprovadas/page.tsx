import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelLojasAprovadas } from "@/modules/lojistas/components/PainelLojasAprovadas";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["ASSOCIACAO"]}>
                    <PainelLojasAprovadas />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
