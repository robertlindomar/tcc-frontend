import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { PainelMissoesConsumidor } from "@/modules/missao-consumidores/components/PainelMissoesConsumidor";

export default function MissaoConsumidoresPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <PainelMissoesConsumidor />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
