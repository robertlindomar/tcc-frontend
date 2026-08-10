import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudConsumidores } from "@/modules/consumidores/components/CrudConsumidores";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudConsumidores />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
