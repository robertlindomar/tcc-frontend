import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudSorteios } from "@/modules/sorteios/components/CrudSorteios";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudSorteios />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
