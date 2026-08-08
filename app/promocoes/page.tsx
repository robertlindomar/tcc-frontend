import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudPromocoes } from "@/modules/promocoes/components/CrudPromocoes";

export default function PromocoesPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudPromocoes />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
