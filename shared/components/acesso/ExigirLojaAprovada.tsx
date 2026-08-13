"use client";

import { ReactNode, useEffect, useState } from "react";
import { buscarUsuarioLogadoAtual } from "@/modules/auth/services/servicoAuth";
import { buscarMeuPerfilLojista } from "@/modules/lojistas/services/servicoLojista";
import type { StatusLojista } from "@/modules/lojistas/types/lojista.types";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";
import { classificarErroApi, obterMensagemErroApi } from "@/shared/utils/erroApi";
import { AvisoAcesso } from "./AvisoAcesso";

type ExigirLojaAprovadaProps = {
    /** Nome do recurso na mensagem, ex.: "produtos". */
    recurso: string;
    children: ReactNode;
};

type Situacao =
    | { etapa: "carregando" }
    | { etapa: "outroPapel" }
    | { etapa: "semLoja" }
    | { etapa: "status"; status: StatusLojista }
    | { etapa: "erro"; mensagem: string };

/**
 * Recursos comerciais exigem lojista APROVADO no backend. Aqui a tela mostra o
 * motivo em vez de deixar a requisição falhar com 403 cru.
 */
export function ExigirLojaAprovada({ recurso, children }: ExigirLojaAprovadaProps) {
    const [situacao, setSituacao] = useState<Situacao>({ etapa: "carregando" });

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            const sessao = buscarUsuarioLogadoAtual();
            const papel: PapelUsuario | null = sessao?.usuario?.role ?? null;

            if (papel !== "LOJISTA") {
                setSituacao({ etapa: "outroPapel" });
                return;
            }

            try {
                const perfil = await buscarMeuPerfilLojista();
                if (cancelado) return;

                setSituacao(
                    perfil
                        ? { etapa: "status", status: perfil.status }
                        : { etapa: "semLoja" },
                );
            } catch (error) {
                if (cancelado) return;

                if (classificarErroApi(error) === "autenticacao") {
                    return;
                }

                setSituacao({
                    etapa: "erro",
                    mensagem: obterMensagemErroApi(
                        error,
                        "Não foi possível verificar a situação da sua loja.",
                    ),
                });
            }
        }

        void carregar();
        return () => {
            cancelado = true;
        };
    }, []);

    if (situacao.etapa === "carregando") {
        return <p className="text-sm text-slate-500">Carregando…</p>;
    }

    if (situacao.etapa === "outroPapel") {
        return (
            <AvisoAcesso
                titulo="Acesso não disponível"
                mensagem="Esta área é exclusiva de lojistas com loja aprovada."
                tom="negado"
            />
        );
    }

    if (situacao.etapa === "semLoja") {
        return (
            <AvisoAcesso
                titulo="Cadastre sua loja"
                mensagem={`Envie o pré-cadastro da sua loja para liberar ${recurso}.`}
                tom="neutro"
                acao={{ href: "/minha-loja", label: "Ir para Minha loja" }}
            />
        );
    }

    if (situacao.etapa === "erro") {
        return (
            <AvisoAcesso
                titulo="Não foi possível carregar"
                mensagem={situacao.mensagem}
                tom="negado"
                acao={{ href: "/minha-loja", label: "Ir para Minha loja" }}
            />
        );
    }

    if (situacao.status === "PENDENTE") {
        return (
            <AvisoAcesso
                titulo="Aguardando aprovação"
                mensagem={`Aguarde a aprovação da sua loja para liberar ${recurso}.`}
                tom="aguardando"
                acao={{ href: "/minha-loja", label: "Ver situação da loja" }}
            />
        );
    }

    if (situacao.status === "REJEITADO") {
        return (
            <AvisoAcesso
                titulo="Loja não aprovada"
                mensagem={`Sua loja não está aprovada pela associação, então ${recurso} não estão disponíveis.`}
                tom="negado"
                acao={{ href: "/minha-loja", label: "Ver situação da loja" }}
            />
        );
    }

    return <>{children}</>;
}
