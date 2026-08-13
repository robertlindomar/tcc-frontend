import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelPreCadastros } from "@/modules/lojistas/components/PainelPreCadastros";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["ASSOCIACAO"]}>
                    <PainelPreCadastros />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
