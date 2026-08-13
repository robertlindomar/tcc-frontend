"use client";

import { useEffect, useState } from "react";
import { buscarUsuarioLogadoAtual } from "@/modules/auth/services/servicoAuth";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";

export type SessaoUsuario = {
    papel: PapelUsuario | null;
    nome: string;
    carregando: boolean;
};

/**
 * Papel e nome da sessão salva no navegador. A leitura acontece após a
 * hidratação (localStorage é sistema externo) e num microtask, para não
 * disparar setState síncrono dentro do efeito.
 */
export function useSessaoUsuario(): SessaoUsuario {
    const [sessao, setSessao] = useState<Omit<SessaoUsuario, "carregando">>({
        papel: null,
        nome: "Usuário",
    });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let cancelado = false;

        void Promise.resolve().then(() => {
            if (cancelado) {
                return;
            }

            const atual = buscarUsuarioLogadoAtual();

            setSessao({
                papel: atual?.usuario?.role ?? null,
                nome: atual?.usuario?.nome ?? "Usuário",
            });
            setCarregando(false);
        });

        return () => {
            cancelado = true;
        };
    }, []);

    return { ...sessao, carregando };
}
