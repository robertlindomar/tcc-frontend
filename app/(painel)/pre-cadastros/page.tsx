import { PainelPreCadastros } from "@/modules/lojistas/components/PainelPreCadastros";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <PainelPreCadastros />
        </ExigirPapel>
    );
}
