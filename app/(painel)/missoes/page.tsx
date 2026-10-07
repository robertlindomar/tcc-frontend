import { CrudMissoes } from "@/modules/missoes/components/CrudMissoes";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="as missões">
            <CrudMissoes />
        </ExigirLojaAprovada>
    );
}
