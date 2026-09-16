/** Logo alinhada ao mock de auth (ícone geométrico + wordmark). */
export function LogoMarcaAuth({ variante = "clara" }: { variante?: "clara" | "escura" }) {
    const texto = variante === "clara" ? "text-white" : "text-[#07162E]";
    const tag = variante === "clara" ? "text-white/55" : "text-[#4d6358]";

    return (
        <div className="flex items-center gap-3">
            <svg
                width="44"
                height="44"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
            >
                <defs>
                    <linearGradient id="logoEmeraldAuth" x1="24" y1="4" x2="68" y2="68">
                        <stop stopColor="#02C394" />
                        <stop offset="1" stopColor="#019575" />
                    </linearGradient>
                    <linearGradient id="logoCoralAuth" x1="48" y1="28" x2="92" y2="92">
                        <stop stopColor="#FF968A" />
                        <stop offset="1" stopColor="#FF786C" />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#logoEmeraldAuth)"
                    d="M36 4h32v32c0 17.673-14.327 32-32 32H4V36C4 18.327 18.327 4 36 4Z"
                />
                <path
                    fill="url(#logoCoralAuth)"
                    d="M60 28h32v32c0 17.673-14.327 32-32 32H28V60c0-17.673 14.327-32 32-32Z"
                />
                <circle cx="44" cy="52" r="14" fill="#68AE87" />
            </svg>
            <div>
                <p className={`text-[1.05rem] font-bold leading-tight tracking-tight ${texto}`}>
                    Conecta Comércio
                </p>
                <p
                    className={`mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${tag}`}
                >
                    Comércio local mais forte juntos
                </p>
            </div>
        </div>
    );
}
