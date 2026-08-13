"use client";

import { ReactNode } from "react";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";
import { useSessaoUsuario } from "@/shared/hooks/useSessaoUsuario";
import { AvisoAcesso } from "./AvisoAcesso";

type ExigirPapelProps = {
    papeis: PapelUsuario[];
    children: ReactNode;
};

/**
 * Esconde telas que não pertencem ao papel. É UX: o backend continua sendo a
 * fonte de autorização.
 */
export function ExigirPapel({ papeis, children }: ExigirPapelProps) {
    const { papel, carregando } = useSessaoUsuario();

    if (carregando) {
        return <p className="text-sm text-slate-500">Carregando…</p>;
    }

    if (!papel || !papeis.includes(papel)) {
        return (
            <AvisoAcesso
                titulo="Acesso não disponível"
                mensagem="Esta área não faz parte do seu perfil de acesso."
                tom="negado"
            />
        );
    }

    return <>{children}</>;
}
