import { CrudCampanhas } from "@/modules/campanhas/components/CrudCampanhas";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <CrudCampanhas />
        </ExigirPapel>
    );
}
