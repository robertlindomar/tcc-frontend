import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudCampanhas } from "@/modules/campanhas/components/CrudCampanhas";

export default function CampanhasPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudCampanhas />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
