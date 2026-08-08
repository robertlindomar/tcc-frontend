import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudConsumidores } from "@/modules/consumidores/components/CrudConsumidores";

export default function ConsumidoresPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudConsumidores />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
