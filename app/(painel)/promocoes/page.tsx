import { CrudPromocoes } from "@/modules/promocoes/components/CrudPromocoes";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="as promoções">
            <CrudPromocoes />
        </ExigirLojaAprovada>
    );
}
