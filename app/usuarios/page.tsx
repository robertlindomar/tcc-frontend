import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudUsuarios } from "@/modules/usuarios/components/CrudUsuarios";

export default function UsuariosPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudUsuarios />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
