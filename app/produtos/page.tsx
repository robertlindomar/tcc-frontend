import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudProdutos } from "@/modules/produtos/components/CrudProdutos";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudProdutos />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
