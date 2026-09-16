import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelDashboard } from "@/modules/dashboard/components/PainelDashboard";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function DashboardPage() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <ExigirPapel papeis={["ASSOCIACAO"]}>
                    <PainelDashboard />
                </ExigirPapel>
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
