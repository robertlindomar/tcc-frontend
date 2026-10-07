import { PainelLojasAprovadas } from "@/modules/lojistas/components/PainelLojasAprovadas";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <PainelLojasAprovadas />
        </ExigirPapel>
    );
}
