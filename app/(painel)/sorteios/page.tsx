import { CrudSorteios } from "@/modules/sorteios/components/CrudSorteios";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <CrudSorteios />
        </ExigirPapel>
    );
}
