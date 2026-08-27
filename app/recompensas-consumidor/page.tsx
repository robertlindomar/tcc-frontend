import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { AvisoCanalConsumidorMobile } from "@/shared/components/acesso/AvisoCanalConsumidorMobile";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["CONSUMIDOR"]}>
                    <AvisoCanalConsumidorMobile />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
