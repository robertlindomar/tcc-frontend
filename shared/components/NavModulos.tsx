import Link from "next/link";

const links = [
    { href: "/usuarios", label: "Usuários" },
    { href: "/associacoes", label: "Associações" },
    { href: "/lojistas", label: "Lojistas" },
    { href: "/consumidores", label: "Consumidores" },
    { href: "/produtos", label: "Produtos" },
    { href: "/promocoes", label: "Promoções" },
    { href: "/eventos", label: "Eventos" },
    { href: "/missoes", label: "Missões" },
    { href: "/campanhas", label: "Campanhas" },
    { href: "/sorteios", label: "Sorteios" },
] as const;

type Href = (typeof links)[number]["href"];

interface NavModulosProps {
    atual: Href;
}

export function NavModulos({ atual }: NavModulosProps) {
    return (
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
            {links
                .filter((link) => link.href !== atual)
                .map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-blue-600 hover:underline"
                    >
                        {link.label}
                    </Link>
                ))}
        </p>
    );
}
