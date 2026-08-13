import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudEventos } from "@/modules/eventos/components/CrudEventos";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirLojaAprovada recurso="os eventos">
                    <CrudEventos />
                </ExigirLojaAprovada>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
