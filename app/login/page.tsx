import { FormularioLogin } from "@/modules/auth/components/FormularioLogin";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
            <FormularioLogin />
        </main>
    );
}
