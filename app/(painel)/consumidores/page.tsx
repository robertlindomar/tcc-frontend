import { PainelConsumidoresDaLoja } from "@/modules/consumidores/components/PainelConsumidoresDaLoja";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="os visitantes da loja">
            <PainelConsumidoresDaLoja />
        </ExigirLojaAprovada>
    );
}
