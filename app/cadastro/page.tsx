import Image from "next/image";
import { FormularioCadastro } from "@/modules/auth/components/FormularioCadastro";

export default function CadastroPage() {
    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            <aside className="relative hidden overflow-hidden bg-sidebar text-sidebar-foreground lg:flex lg:flex-col lg:justify-between lg:p-10">
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/marca/conecta-comercio-simbolo.png"
                            alt=""
                            width={44}
                            height={44}
                            className="h-11 w-11 rounded-xl object-cover"
                            priority
                        />
                        <div>
                            <p className="text-lg font-bold text-white">Conecta Comércio</p>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-muted">
                                Comércio local mais forte juntos
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-md">
                    <h1 className="text-4xl font-bold tracking-tight text-white">
                        Fortaleça o comércio da sua cidade
                    </h1>
                    <p className="mt-3 text-base text-sidebar-muted">
                        Juntos por um comércio local mais próspero.
                    </p>
                </div>

                <div className="relative z-10 overflow-hidden rounded-3xl border border-white/10">
                    <Image
                        src="/marca/auth-commerce-hero.png"
                        alt=""
                        width={720}
                        height={420}
                        className="h-56 w-full object-cover"
                        priority
                    />
                </div>

                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-primary-bright/30 blur-2xl"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-24 right-8 h-40 w-40 rounded-full bg-coral-soft/40 blur-2xl"
                />
            </aside>

            <section className="relative flex items-center justify-center bg-background px-4 py-10">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                        background:
                            "radial-gradient(ellipse 50% 40% at 90% 10%, rgba(2,195,148,0.16), transparent), radial-gradient(ellipse 40% 35% at 10% 90%, rgba(255,120,108,0.12), transparent)",
                    }}
                />
                <div className="relative z-10 w-full max-w-md">
                    <FormularioCadastro />
                </div>
            </section>
        </main>
    );
}
