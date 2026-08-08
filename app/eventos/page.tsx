import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudEventos } from "@/modules/eventos/components/CrudEventos";

export default function EventosPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudEventos />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
