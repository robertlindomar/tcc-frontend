import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudAssociacoes } from "@/modules/associacoes/components/CrudAssociacoes";

export default function AssociacoesPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudAssociacoes />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
