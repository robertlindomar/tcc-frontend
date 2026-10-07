import type { ReactNode } from "react";
import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

/** Mantém a sessão, o menu e o cabeçalho montados entre as telas do painel. */
export default function LayoutPainel({ children }: { children: ReactNode }) {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>{children}</LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
