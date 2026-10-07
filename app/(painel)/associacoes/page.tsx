import { CrudAssociacoes } from "@/modules/associacoes/components/CrudAssociacoes";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <CrudAssociacoes />
        </ExigirPapel>
    );
}
