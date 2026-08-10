import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudAssociacoes } from "@/modules/associacoes/components/CrudAssociacoes";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudAssociacoes />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
