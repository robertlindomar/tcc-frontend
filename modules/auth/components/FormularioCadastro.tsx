"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { BotaoAuth } from "./BotaoAuth";
import { CartaoAuth } from "./CartaoAuth";
import { CampoFormulario } from "./CampoFormulario";
import { cadastrarUsuario } from "../services/servicoAuth";

/** Cadastro web público: apenas lojista (API ainda aceita CONSUMIDOR para o app mobile). */
const PAPEL_CADASTRO_WEB = "LOJISTA" as const;

export function FormularioCadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErro("");

        if (senha.length < 6) {
            setErro("A senha precisa ter pelo menos 6 caracteres.");
            return;
        }

        if (senha !== confirmarSenha) {
            setErro("As senhas não conferem.");
            return;
        }

        setCarregando(true);

        try {
            await cadastrarUsuario({
                nome,
                email,
                senha,
                role: PAPEL_CADASTRO_WEB,
            });

            router.push("/login");
        } catch (error) {
            setErro(obterMensagemErroApi(error, "Erro ao cadastrar usuário."));
        } finally {
            setCarregando(false);
        }
    }

    return (
        <CartaoAuth
            titulo="Cadastro de lojista"
            subtitulo="Crie sua conta para pré-cadastrar a loja na associação"
            rodape={
                <p>
                    Já possui conta?{" "}
                    <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                        Fazer login
                    </Link>
                </p>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {erro && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {erro}
                    </div>
                )}

                <CampoFormulario
                    label="Nome"
                    name="nome"
                    type="text"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                />

                <CampoFormulario
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <CampoFormulario
                    label="Senha"
                    name="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    required
                />

                <CampoFormulario
                    label="Confirmar senha"
                    name="confirmarSenha"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmarSenha}
                    onChange={(event) => setConfirmarSenha(event.target.value)}
                    required
                />

                <BotaoAuth type="submit" carregando={carregando}>
                    Cadastrar lojista
                </BotaoAuth>
            </form>
        </CartaoAuth>
    );
}
