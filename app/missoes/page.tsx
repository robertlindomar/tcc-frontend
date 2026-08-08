import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudMissoes } from "@/modules/missoes/components/CrudMissoes";

export default function MissoesPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudMissoes />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
