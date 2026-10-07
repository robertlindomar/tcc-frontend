import { PainelDashboard } from "@/modules/dashboard/components/PainelDashboard";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function DashboardPage() {
    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <PainelDashboard />
        </ExigirPapel>
    );
}
