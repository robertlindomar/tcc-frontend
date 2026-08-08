"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PapelUsuario } from "@/modules/usuarios/types/usuario.types";
import { obterMensagemErroApi } from "@/shared/utils/erroApi";
import { BotaoAuth } from "./BotaoAuth";
import { CartaoAuth } from "./CartaoAuth";
import { CampoFormulario } from "./CampoFormulario";
import { cadastrarUsuario } from "../services/servicoAuth";

const roles: Array<{ value: PapelUsuario; label: string }> = [
    { value: "CONSUMIDOR", label: "Consumidor" },
    { value: "LOJISTA", label: "Lojista" },
    { value: "ASSOCIACAO", label: "Associação" },
];

export function FormularioCadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [role, setRole] = useState<PapelUsuario>("CONSUMIDOR");

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
                role,
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
            titulo="Criar conta"
            subtitulo="Cadastre-se para acessar o sistema"
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

                <div className="space-y-1">
                    <label htmlFor="role" className="text-sm font-medium text-slate-700">
                        Tipo de conta
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={role}
                        onChange={(event) => setRole(event.target.value as PapelUsuario)}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                    >
                        {roles.map((opcao) => (
                            <option key={opcao.value} value={opcao.value}>
                                {opcao.label}
                            </option>
                        ))}
                    </select>
                </div>

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
                    Cadastrar
                </BotaoAuth>
            </form>
        </CartaoAuth>
    );
}
