import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudEventos } from "@/modules/eventos/components/CrudEventos";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudEventos />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
