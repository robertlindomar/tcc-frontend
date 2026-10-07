import { PainelMinhaLoja } from "@/modules/lojistas/components/PainelMinhaLoja";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["LOJISTA"]}>
            <PainelMinhaLoja />
        </ExigirPapel>
    );
}
