import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudAssociacoes } from "@/modules/associacoes/components/CrudAssociacoes";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["ASSOCIACAO"]}>
                    <CrudAssociacoes />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
