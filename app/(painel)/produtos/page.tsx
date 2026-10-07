import { CrudProdutos } from "@/modules/produtos/components/CrudProdutos";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="os produtos">
            <CrudProdutos />
        </ExigirLojaAprovada>
    );
}
