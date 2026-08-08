import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudSorteios } from "@/modules/sorteios/components/CrudSorteios";

export default function SorteiosPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudSorteios />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
