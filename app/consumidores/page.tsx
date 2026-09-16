import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelConsumidoresDaLoja } from "@/modules/consumidores/components/PainelConsumidoresDaLoja";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="os visitantes da loja">
                    <PainelConsumidoresDaLoja />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
