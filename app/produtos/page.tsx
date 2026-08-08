import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { CrudProdutos } from "@/modules/produtos/components/CrudProdutos";

export default function ProdutosPage() {
    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900">
            <div className="mx-auto max-w-7xl">
                <ExigirAutenticacao>
                    <CrudProdutos />
                </ExigirAutenticacao>
            </div>
        </main>
    );
}
