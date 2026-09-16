"use client";

import { useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { buscarResumoDashboard } from "../services/servicoDashboard";
import { ResumoDashboard } from "../types/dashboard.types";
import { CartaoMetrica, ICONES_METRICA } from "./CartaoMetrica";
import { ItemAtividade } from "./ItemAtividade";

export function PainelDashboard() {
    const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        let ativo = true;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const dados = await buscarResumoDashboard();
                if (ativo) {
                    setResumo(dados);
                }
            } catch (error) {
                if (ativo) {
                    setErro(obterMensagemErroApi(error, "Erro ao carregar o dashboard."));
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        void carregar();
        return () => {
            ativo = false;
        };
    }, []);

    return (
        <div className="painel-pagina space-y-6">
            <div>
                <p className="painel-eyebrow">Associação</p>
                <h1 className="painel-titulo">Dashboard</h1>
                <p className="painel-subtitulo">
                    Indicadores operacionais da sua associação.
                </p>
            </div>

            {erro ? (
                <div className="painel-card border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p>{erro}</p>
                    {erro.toLowerCase().includes("associacao nao encontrada") ? (
                        <p className="mt-2">
                            Cadastre o perfil em{" "}
                            <a href="/associacoes" className="font-semibold underline">
                                Minha associação
                            </a>{" "}
                            antes de usar o dashboard e as campanhas.
                        </p>
                    ) : null}
                </div>
            ) : null}

            {carregando ? (
                <p className="text-sm text-muted">Carregando indicadores…</p>
            ) : null}

            {!carregando && !erro && resumo ? (
                <>
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <CartaoMetrica
                            valor={resumo.metricas.lojasAguardandoAprovacao}
                            rotulo="Lojas aguardando aprovação"
                            icone={ICONES_METRICA.lojasPendentes}
                            tom="verde"
                        />
                        <CartaoMetrica
                            valor={resumo.metricas.campanhasCadastradas}
                            rotulo="Campanhas cadastradas"
                            icone={ICONES_METRICA.campanhas}
                            tom="coral"
                        />
                        <CartaoMetrica
                            valor={resumo.metricas.sorteiosCadastrados}
                            rotulo="Sorteios cadastrados"
                            icone={ICONES_METRICA.sorteios}
                            tom="ambar"
                        />
                        <CartaoMetrica
                            valor={resumo.metricas.totalLojasParticipantes}
                            rotulo="Total de lojas participantes"
                            icone={ICONES_METRICA.participantes}
                            tom="roxo"
                        />
                    </section>

                    <section className="painel-card overflow-hidden">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <h2 className="text-base font-semibold text-navy">
                                Atividades recentes
                            </h2>
                        </div>
                        {resumo.atividadesRecentes.length === 0 ? (
                            <p className="px-5 py-10 text-center text-sm text-muted">
                                Nenhuma atividade recente para esta associação.
                            </p>
                        ) : (
                            <ul>
                                {resumo.atividadesRecentes.map((atividade) => (
                                    <ItemAtividade
                                        key={`${atividade.tipo}-${atividade.entidadeId}-${atividade.ocorridoEm}`}
                                        atividade={atividade}
                                    />
                                ))}
                            </ul>
                        )}
                    </section>
                </>
            ) : null}
        </div>
    );
}
