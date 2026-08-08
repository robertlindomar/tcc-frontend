import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudLojistas } from "@/modules/lojistas/components/CrudLojistas";

export default function LojistasPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudLojistas />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
