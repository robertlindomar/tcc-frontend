"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CampoBusca } from "@/shared/components/ui/CampoBusca";
import { CampoData } from "@/shared/components/ui/CampoData";
import { validarDataNaoPassada } from "@/shared/utils/dataCivil";
import { correspondeBusca, rotularContagem } from "@/shared/utils/buscaTexto";
import { ModalOverlay } from "@/shared/components/ui/ModalOverlay";
import {
    atualizarCampanha,
    criarCampanha,
    deletarCampanha,
    listarCampanhas,
} from "../services/servicoCampanha";
import { Campanha } from "../types/campanha.types";
import { obterCodigoErroApi, obterNumeroErroApi } from "@/shared/utils/erroApi";
import {
    CampoFormCampanha,
    CODIGOS_EXCLUSAO_COM_HISTORICO,
    descreverRiscoExclusao,
    HistoricoExclusao,
} from "../utils/campanhaEdicao";
import {
    ErroFormCampanha,
    obterErroFormCampanha,
    obterMensagemErroCampanha,
} from "../utils/erroCampanha";
import { ModalCampanha } from "./ModalCampanha";
import { TabelaCampanhas } from "./TabelaCampanhas";

type FormState = {
    nome: string;
    descricao: string;
    qrcode: string;
    dataInicio: string;
    dataFim: string;
    valorPorTicket: string;
};

const formInicial: FormState = {
    nome: "",
    descricao: "",
    qrcode: "",
    dataInicio: "",
    dataFim: "",
    valorPorTicket: "10",
};

export function CrudCampanhas() {
    const [campanhas, setCampanhas] = useState<Campanha[]>([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<number | null>(null);
    const [erro, setErro] = useState("");
    const [erroForm, setErroForm] = useState<ErroFormCampanha | null>(null);
    const [erroExclusao, setErroExclusao] = useState("");
    const [historicoExclusao, setHistoricoExclusao] = useState<HistoricoExclusao | null>(null);
    const [cienteRisco, setCienteRisco] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [campanhaEditando, setCampanhaEditando] = useState<Campanha | null>(null);
    const [campanhaExcluindo, setCampanhaExcluindo] = useState<Campanha | null>(null);
    const [campanhaAberta, setCampanhaAberta] = useState<Campanha | null>(null);
    const [form, setForm] = useState<FormState>(formInicial);

    const tituloModal = useMemo(
        () => (campanhaEditando ? "Editar campanha" : "Nova campanha"),
        [campanhaEditando],
    );

    const campanhasFiltrados = useMemo(
        () =>
            campanhas.filter((item) =>
                correspondeBusca(busca, {
                    textos: [item.nome, item.descricao],
                }),
            ),
        [busca, campanhas],
    );

    useEffect(() => {
        let cancelado = false;

        listarCampanhas()
            .then((lista) => {
                if (!cancelado) {
                    setCampanhas(lista);
                }
            })
            .catch((error: unknown) => {
                if (!cancelado) {
                    setErro(obterMensagemErroCampanha(error, "Erro ao carregar campanhas."));
                }
            })
            .finally(() => {
                if (!cancelado) {
                    setCarregando(false);
                }
            });

        return () => {
            cancelado = true;
        };
    }, []);

    function abrirCriacao() {
        setCampanhaEditando(null);
        setForm(formInicial);
        setErroForm(null);
        setModalAberto(true);
    }

    function aplicarCampanhaAtualizada(atualizada: Campanha) {
        setCampanhas((lista) =>
            lista.map((item) => (item.id === atualizada.id ? atualizada : item)),
        );
        setCampanhaAberta((aberta) => (aberta?.id === atualizada.id ? atualizada : aberta));
    }

    function abrirEdicao(campanha: Campanha) {
        setCampanhaAberta(null);
        setCampanhaEditando(campanha);
        setForm({
            nome: campanha.nome,
            descricao: campanha.descricao ?? "",
            qrcode: campanha.qrcode ?? "",
            dataInicio: campanha.dataInicioCivil,
            dataFim: campanha.dataFimCivil,
            valorPorTicket: String(campanha.valorPorTicket),
        });
        setErroForm(null);
        setModalAberto(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberto(false);
        setCampanhaEditando(null);
        setForm(formInicial);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErroForm(null);
        const falhar = (campo: CampoFormCampanha | null, mensagem: string) =>
            setErroForm({ campo, mensagem });

        const nome = form.nome.trim();
        if (!nome) {
            falhar("nome", "Nome é obrigatório.");
            return;
        }
        if (!form.dataInicio || !form.dataFim) {
            falhar("periodo", "Informe início e fim da campanha.");
            return;
        }
        const erroData =
            validarDataNaoPassada(form.dataInicio, {
                rotulo: "início",
                obrigatorio: true,
                valorOriginal: campanhaEditando?.dataInicioCivil,
            }) ??
            validarDataNaoPassada(form.dataFim, {
                rotulo: "fim",
                obrigatorio: true,
                valorOriginal: campanhaEditando?.dataFimCivil,
            });
        if (erroData) {
            falhar("periodo", erroData);
            return;
        }
        if (form.dataFim < form.dataInicio) {
            falhar("periodo", "A data de fim deve ser maior ou igual à data de início.");
            return;
        }
        const valorPorTicket = Number(form.valorPorTicket.replace(",", "."));
        if (!Number.isFinite(valorPorTicket) || valorPorTicket <= 0) {
            falhar("valor", "Valor por ticket deve ser maior que zero.");
            return;
        }

        setSalvando(true);

        try {
            const dados = {
                nome,
                descricao: form.descricao.trim() || null,
                qrcode: form.qrcode.trim() || null,
                dataInicio: form.dataInicio,
                dataFim: form.dataFim,
                valorPorTicket,
            };

            if (campanhaEditando) {
                aplicarCampanhaAtualizada(await atualizarCampanha(campanhaEditando.id, dados));
            } else {
                const criado = await criarCampanha(dados);
                setCampanhas((lista) => [criado, ...lista]);
            }

            fecharModal();
        } catch (error) {
            setErroForm(obterErroFormCampanha(error, "Erro ao salvar campanha."));
        } finally {
            setSalvando(false);
        }
    }

    function abrirExclusao(campanha: Campanha | null) {
        setErroExclusao("");
        setHistoricoExclusao(null);
        setCienteRisco(false);
        setCampanhaExcluindo(campanha);
    }

    async function confirmarExclusao(forcar = false) {
        if (!campanhaExcluindo) {
            return;
        }

        setExcluindoId(campanhaExcluindo.id);
        setErroExclusao("");

        try {
            await deletarCampanha(campanhaExcluindo.id, forcar);
            setCampanhas((lista) =>
                lista.filter((item) => item.id !== campanhaExcluindo.id),
            );
            abrirExclusao(null);
        } catch (error) {
            const codigo = obterCodigoErroApi(error);
            if (!forcar && codigo && CODIGOS_EXCLUSAO_COM_HISTORICO.includes(codigo)) {
                setHistoricoExclusao({
                    totalTickets: obterNumeroErroApi(error, "totalTickets") ?? 0,
                    totalNotas: obterNumeroErroApi(error, "totalNotas") ?? 0,
                    totalResultados: obterNumeroErroApi(error, "totalResultados") ?? 0,
                });
            } else {
                setErroExclusao(obterMensagemErroCampanha(error, "Erro ao excluir campanha."));
            }
        } finally {
            setExcluindoId(null);
        }
    }

    const classeCampo =
        "mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-navy outline-none focus:border-primary";
    const classeCampoInvalido =
        "mt-1 w-full rounded-xl border border-red-400 bg-surface px-3 py-2 text-navy outline-none focus:border-red-500";
    const erroDoCampo = (campo: CampoFormCampanha) =>
        erroForm?.campo === campo ? erroForm.mensagem : null;
    const classeDoCampo = (campo: CampoFormCampanha) =>
        erroDoCampo(campo) ? classeCampoInvalido : classeCampo;

    return (
        <div className="painel-pagina space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="painel-eyebrow">Associação</p>
                    <h1 className="painel-titulo">Campanhas</h1>
                    <p className="painel-subtitulo">
                        Defina período e quanto cada ticket custa em reais. Todas as lojas
                        aprovadas participam automaticamente. Cada edição tem seu sorteio:
                        clique na campanha para ver os tickets, sortear ou reativá-la.
                    </p>
                </div>

                <button type="button" onClick={abrirCriacao} className="btn-primario text-sm">
                    Nova campanha
                </button>
            </div>

            {erro ? (
                <div className="painel-card border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            <CampoBusca
                valor={busca}
                onChange={setBusca}
                placeholder="Buscar por nome ou descrição…"
                rotuloContagem={rotularContagem(campanhasFiltrados.length, "campanha", "campanhas")}
            />

            <TabelaCampanhas
                campanhas={campanhasFiltrados}
                mensagemVazia={
                    campanhas.length > 0
                        ? "Nenhuma campanha encontrada para essa busca."
                        : undefined
                }
                onAbrir={setCampanhaAberta}
                onEditar={abrirEdicao}
                onExcluir={abrirExclusao}
                carregando={carregando}
                excluindoId={excluindoId}
            />

            {modalAberto ? (
                <ModalOverlay onFechar={fecharModal} bloqueado={salvando}>
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-navy">
                                {tituloModal}
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                {campanhaEditando
                                    ? "Altere os dados da campanha."
                                    : "Informe vigência e valor por ticket."}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={fecharModal}
                            disabled={salvando}
                            className="px-2 py-1 text-2xl leading-none text-muted hover:text-navy disabled:opacity-50"
                            aria-label="Fechar modal"
                        >
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {erroForm && erroForm.campo === null ? (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {erroForm.mensagem}
                            </div>
                        ) : null}

                        <label className="block text-sm font-medium text-navy">
                            Nome
                            <input
                                type="text"
                                value={form.nome}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        nome: event.target.value,
                                    }))
                                }
                                className={classeDoCampo("nome")}
                                aria-invalid={Boolean(erroDoCampo("nome"))}
                                required
                            />
                            <AvisoCampo mensagem={erroDoCampo("nome")} />
                        </label>

                        <div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <CampoData
                                    rotulo="Início"
                                    valor={form.dataInicio}
                                    onChange={(dataInicio) =>
                                        setForm((atual) => ({ ...atual, dataInicio }))
                                    }
                                    valorOriginal={campanhaEditando?.dataInicioCivil}
                                    className={classeDoCampo("periodo")}
                                    obrigatorio
                                />
                                <CampoData
                                    rotulo="Fim"
                                    valor={form.dataFim}
                                    onChange={(dataFim) =>
                                        setForm((atual) => ({ ...atual, dataFim }))
                                    }
                                    valorOriginal={campanhaEditando?.dataFimCivil}
                                    minimo={form.dataInicio}
                                    className={classeDoCampo("periodo")}
                                    obrigatorio
                                />
                            </div>
                            <AvisoCampo mensagem={erroDoCampo("periodo")} />
                        </div>

                        <label className="block text-sm font-medium text-navy">
                            Valor por ticket (R$)
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={form.valorPorTicket}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        valorPorTicket: event.target.value,
                                    }))
                                }
                                className={classeDoCampo("valor")}
                                aria-invalid={Boolean(erroDoCampo("valor"))}
                                required
                            />
                            <AvisoCampo mensagem={erroDoCampo("valor")} />
                            <span className="mt-1 block text-xs font-normal text-muted">
                                Ex.: 10 = a cada R$ 10 em notas válidas, 1 ticket.
                            </span>
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            Descrição (opcional)
                            <textarea
                                value={form.descricao}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        descricao: event.target.value,
                                    }))
                                }
                                rows={3}
                                className={classeCampo}
                            />
                        </label>

                        <label className="block text-sm font-medium text-navy">
                            QR Code (opcional)
                            <input
                                type="text"
                                value={form.qrcode}
                                onChange={(event) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        qrcode: event.target.value,
                                    }))
                                }
                                className={classeCampo}
                            />
                        </label>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={fecharModal}
                                disabled={salvando}
                                className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={salvando}
                                className="btn-primario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {salvando ? "Salvando..." : "Salvar"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            ) : null}

            {campanhaAberta ? (
                <ModalCampanha
                    key={campanhaAberta.id}
                    campanha={campanhaAberta}
                    onFechar={() => setCampanhaAberta(null)}
                    onAtualizada={aplicarCampanhaAtualizada}
                    onEditar={abrirEdicao}
                />
            ) : null}

            {campanhaExcluindo ? (
                <ModalOverlay
                    onFechar={() => {
                        if (excluindoId === null) {
                            abrirExclusao(null);
                        }
                    }}
                    bloqueado={excluindoId !== null}
                    largura="sm"
                >
                    <h2 className="text-xl font-semibold text-navy">
                        {historicoExclusao ? "Atenção: exclusão definitiva" : "Excluir campanha"}
                    </h2>
                    {historicoExclusao ? (
                        <div className="mt-3 space-y-3 text-sm">
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700"
                            >
                                <p className="font-semibold">
                                    {campanhaExcluindo.nome} já tem histórico. Excluir vai apagar
                                    permanentemente, em todas as edições:
                                </p>
                                <ul className="mt-2 list-disc space-y-1 pl-5">
                                    {descreverRiscoExclusao(historicoExclusao).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                                <p className="mt-2">
                                    Os consumidores perdem esses tickets e não será possível
                                    recuperar nada. Se quiser só tirar a campanha do ar, use
                                    Inativar.
                                </p>
                            </div>
                            <label className="flex items-start gap-2 text-navy">
                                <input
                                    type="checkbox"
                                    checked={cienteRisco}
                                    onChange={(event) => setCienteRisco(event.target.checked)}
                                    className="mt-0.5"
                                />
                                Entendo que esta ação é permanente e quero apagar a campanha
                                com todo o histórico.
                            </label>
                        </div>
                    ) : (
                        <p className="mt-2 text-sm text-muted">
                            Confirma a exclusão de {campanhaExcluindo.nome}? Essa ação
                            não poderá ser desfeita.
                        </p>
                    )}

                    {erroExclusao ? (
                        <div
                            role="alert"
                            className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {erroExclusao}
                        </div>
                    ) : null}

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => abrirExclusao(null)}
                            disabled={excluindoId !== null}
                            className="btn-secundario text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        {historicoExclusao ? (
                            <button
                                type="button"
                                onClick={() => void confirmarExclusao(true)}
                                disabled={excluindoId !== null || !cienteRisco}
                                className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {excluindoId ? "Apagando..." : "Apagar tudo definitivamente"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => void confirmarExclusao()}
                                disabled={excluindoId !== null}
                                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {excluindoId ? "Excluindo..." : "Excluir"}
                            </button>
                        )}
                    </div>
                </ModalOverlay>
            ) : null}
        </div>
    );
}

function AvisoCampo({ mensagem }: { mensagem: string | null }) {
    if (!mensagem) {
        return null;
    }
    return (
        <span role="alert" className="mt-1 block text-xs font-medium text-red-600">
            {mensagem}
        </span>
    );
}
