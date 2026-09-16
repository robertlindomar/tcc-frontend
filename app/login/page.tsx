import Image from "next/image";
import { FormularioLogin } from "@/modules/auth/components/FormularioLogin";
import { LogoMarcaAuth } from "@/modules/auth/components/LogoMarcaAuth";

export default function LoginPage() {
    return (
        <main className="grid min-h-screen lg:grid-cols-[minmax(340px,40%)_1fr]">
            {/* Esquerda — fundo fotográfico full-bleed como no mock */}
            <aside className="relative hidden overflow-hidden lg:block">
                <Image
                    src="/marca/auth-commerce-hero.png"
                    alt=""
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="40vw"
                />
                {/* Escurece o topo para legibilidade do texto */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050a08]/92 via-[#050a08]/72 to-[#050a08]/25" />
                <div className="absolute inset-0 bg-[#050a08]/35" />

                <div className="relative z-10 flex h-full flex-col px-10 pb-10 pt-10">
                    <LogoMarcaAuth variante="clara" />

                    <div className="flex flex-1 flex-col justify-center pb-24">
                        <div className="mb-6 h-[3px] w-12 rounded-full bg-[#02C394]" aria-hidden />
                        <h1 className="max-w-[14ch] text-[3.25rem] font-bold leading-[1.02] tracking-tight">
                            <span className="block text-white">Área</span>
                            <span className="block text-[#02C394]">Administrativa</span>
                        </h1>
                        <p className="mt-5 max-w-sm text-[1.05rem] leading-relaxed text-white/60">
                            Gestão que impulsiona o comércio local.
                        </p>
                    </div>
                </div>

                {/* Formas do logo (C geométricos) — canto inferior esquerdo */}
                <div aria-hidden className="pointer-events-none absolute -bottom-6 -left-8 z-20">
                    <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
                        <path
                            d="M140 40h90v90c0 49.706-40.294 90-90 90H50V130C50 80.294 90.294 40 140 40Z"
                            fill="#02C394"
                            fillOpacity="0.55"
                        />
                        <path
                            d="M200 100h90v90c0 49.706-40.294 90-90 90h-90V190c0-49.706 40.294-90 90-90Z"
                            fill="#FF968A"
                            fillOpacity="0.55"
                        />
                    </svg>
                </div>
            </aside>

            {/* Direita — formulário */}
            <section className="relative flex items-center justify-center overflow-hidden bg-[#f4f6f5] px-4 py-10">
                <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-20 h-80 w-80 rounded-full bg-[#02C394]/15 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#FF968A]/14 blur-3xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-[#a78bfa]/12 blur-3xl"
                />

                <div className="relative z-10 w-full max-w-[520px]">
                    <div className="mb-8 flex justify-center lg:hidden">
                        <LogoMarcaAuth variante="escura" />
                    </div>
                    <FormularioLogin />
                </div>
            </section>
        </main>
    );
}
