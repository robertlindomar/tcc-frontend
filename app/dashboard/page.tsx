import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelDashboard } from "@/modules/dashboard/components/PainelDashboard";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

export default function DashboardPage() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <PainelDashboard />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
