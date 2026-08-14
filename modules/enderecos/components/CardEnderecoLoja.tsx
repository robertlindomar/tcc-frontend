"use client";

import { FormEvent, useEffect, useState } from "react";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import {
    atualizarEndereco,
    buscarEnderecoDoUsuario,
    criarEndereco,
} from "../services/servicoEndereco";
import { Endereco } from "../types/endereco.types";

type CardEnderecoLojaProps = {
    /** Dono do endereço: vem do perfil autenticado, nunca de escolha na tela. */
    usuarioId: number;
    enderecoVinculadoId: number | null;
    /** Sincroniza `lojista.enderecoId` quando um endereço novo é criado. */
    onEnderecoCriado: (enderecoId: number) => Promise<void>;
};

type FormEndereco = {
    cep: string;
    numero: string;
};

function apenasDigitos(valor: string): string {
    return valor.replace(/\D/g, "");
}

function formatarCep(cep: string): string {
    const digitos = apenasDigitos(cep);
    if (digitos.length !== 8) {
        return cep;
    }
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

function descreverEndereco(endereco: Endereco): string {
    const numero = endereco.numero?.trim() ? endereco.numero.trim() : "s/n";
    return `${endereco.rua.nome}, ${numero} — ${endereco.bairro.nome}, ${endereco.cidade.nome}/${endereco.estado.uf}`;
}

export function CardEnderecoLoja({
    usuarioId,
    enderecoVinculadoId,
    onEnderecoCriado,
}: CardEnderecoLojaProps) {
    const [endereco, setEndereco] = useState<Endereco | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [editando, setEditando] = useState(false);
    const [erro, setErro] = useState("");
    const [aviso, setAviso] = useState("");
    const [form, setForm] = useState<FormEndereco>({ cep: "", numero: "" });

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const atual = await buscarEnderecoDoUsuario(usuarioId);
                if (!cancelado) {
                    setEndereco(atual);
                }
            } catch (error) {
                if (!cancelado) {
                    setErro(
                        obterMensagemErroApi(
                            error,
                            "Erro ao carregar o endereço da loja.",
                        ),
                    );
                }
            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        void carregar();

        return () => {
            cancelado = true;
        };
    }, [usuarioId]);

    function abrirFormulario() {
        setForm({
            cep: endereco ? formatarCep(endereco.cep) : "",
            numero: endereco?.numero ?? "",
        });
        setErro("");
        setAviso("");
        setEditando(true);
    }

    async function handleSalvar(event: FormEvent) {
        event.preventDefault();
        setErro("");
        setAviso("");

        const cep = apenasDigitos(form.cep);
        if (cep.length !== 8) {
            setErro("Informe um CEP com 8 dígitos.");
            return;
        }

        const numero = form.numero.trim();

        setSalvando(true);
        try {
            if (endereco) {
                const atualizado = await atualizarEndereco(endereco.id, {
                    cep,
                    numero,
                });
                setEndereco(atualizado);
                setAviso("Endereço atualizado.");
            } else {
                const criado = await criarEndereco({
                    cep,
                    numero: numero || undefined,
                });
                setEndereco(criado);

                if (enderecoVinculadoId !== criado.id) {
                    await onEnderecoCriado(criado.id);
                }
                setAviso("Endereço cadastrado.");
            }
            setEditando(false);
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao salvar o endereço."));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="space-y-4 rounded-[var(--radius)] border border-border bg-surface p-6 shadow-sm">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Endereço da loja
                </h2>
                <p className="mt-1 text-sm text-muted">
                    Informe o CEP: a rua, o bairro, a cidade e o estado são
                    preenchidos automaticamente.
                </p>
            </div>

            {erro ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {erro}
                </div>
            ) : null}

            {aviso ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    {aviso}
                </div>
            ) : null}

            {carregando ? <p className="text-sm text-muted">Carregando…</p> : null}

            {!carregando && editando ? (
                <form onSubmit={handleSalvar} className="space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        CEP
                        <input
                            value={form.cep}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, cep: e.target.value }))
                            }
                            inputMode="numeric"
                            maxLength={9}
                            placeholder="00000-000"
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                            required
                        />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                        Número (opcional)
                        <input
                            value={form.numero}
                            onChange={(e) =>
                                setForm((a) => ({ ...a, numero: e.target.value }))
                            }
                            className="mt-1 w-full border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                        />
                    </label>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setEditando(false)}
                            disabled={salvando}
                            className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={salvando}
                            className="bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {salvando ? "Salvando…" : "Salvar endereço"}
                        </button>
                    </div>
                </form>
            ) : null}

            {!carregando && !editando ? (
                <div className="space-y-3">
                    {endereco ? (
                        <div className="text-sm text-slate-700">
                            <p className="font-medium text-slate-900">
                                {descreverEndereco(endereco)}
                            </p>
                            <p className="mt-1 text-muted">
                                CEP {formatarCep(endereco.cep)}
                            </p>
                        </div>
                    ) : (
                        <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            Endereço ainda não cadastrado.
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={abrirFormulario}
                        className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                        {endereco ? "Editar endereço" : "Cadastrar endereço"}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
