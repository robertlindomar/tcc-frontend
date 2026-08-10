import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudPromocoes } from "@/modules/promocoes/components/CrudPromocoes";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <CrudPromocoes />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
