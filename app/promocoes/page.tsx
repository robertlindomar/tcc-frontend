import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudPromocoes } from "@/modules/promocoes/components/CrudPromocoes";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="as promoções">
                    <CrudPromocoes />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
