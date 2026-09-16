import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudProdutos } from "@/modules/produtos/components/CrudProdutos";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="os produtos">
                    <CrudProdutos />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
