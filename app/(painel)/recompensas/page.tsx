import { CrudRecompensas } from "@/modules/recompensas/components/CrudRecompensas";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="as recompensas">
            <CrudRecompensas />
        </ExigirLojaAprovada>
    );
}
