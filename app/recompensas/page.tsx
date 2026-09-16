import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudRecompensas } from "@/modules/recompensas/components/CrudRecompensas";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="as recompensas">
                    <CrudRecompensas />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
