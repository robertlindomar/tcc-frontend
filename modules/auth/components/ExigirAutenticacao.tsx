"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buscarToken } from "../services/servicoAuthApi";

const usarMock = process.env.NEXT_PUBLIC_USAR_MOCK === "true";

type ExigirAutenticacaoProps = {
    children: ReactNode;
};

/**
 * Com mock off: exige `auth_token` no localStorage; senão redireciona para /login.
 * Com mock on: libera a rota (fluxo mock independente).
 */
export function ExigirAutenticacao({ children }: ExigirAutenticacaoProps) {
    const router = useRouter();
    const [autorizado, setAutorizado] = useState(usarMock);

    useEffect(() => {
        if (usarMock) {
            return;
        }

        let cancelado = false;

        // Leitura adiada: o efeito não altera estado de forma síncrona.
        void Promise.resolve().then(() => {
            if (cancelado) {
                return;
            }

            if (!buscarToken()) {
                setAutorizado(false);
                router.replace("/login");
                return;
            }

            setAutorizado(true);
        });

        return () => {
            cancelado = true;
        };
    }, [router]);

    if (!autorizado) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
                Verificando autenticação…
            </div>
        );
    }

    return <>{children}</>;
}
