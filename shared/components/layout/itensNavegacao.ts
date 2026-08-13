import {
    Building2,
    CheckCircle2,
    Gift,
    LayoutDashboard,
    Megaphone,
    Package,
    Store,
    Tags,
    Target,
    Trophy,
    Users,
    type LucideIcon,
} from "lucide-react";
import type { PapelUsuario } from "@/modules/usuarios/types/usuario.types";

export type ItemNavegacao = {
    href: string;
    label: string;
    icone: LucideIcon;
    /** Recurso comercial: só opera com loja APROVADA (regra do backend). */
    exigeLojaAprovada?: boolean;
};

const NAV_POR_PAPEL: Record<PapelUsuario, ItemNavegacao[]> = {
    ASSOCIACAO: [
        { href: "/dashboard", label: "Dashboard", icone: LayoutDashboard },
        { href: "/pre-cadastros", label: "Pré-Cadastros", icone: Store },
        { href: "/lojas-aprovadas", label: "Lojas aprovadas", icone: CheckCircle2 },
        { href: "/campanhas", label: "Campanhas", icone: Megaphone },
        { href: "/sorteios", label: "Sorteios", icone: Gift },
        { href: "/associacoes", label: "Minha associação", icone: Building2 },
    ],
    LOJISTA: [
        { href: "/minha-loja", label: "Minha loja", icone: Store },
        { href: "/produtos", label: "Produtos", icone: Package, exigeLojaAprovada: true },
        { href: "/categorias", label: "Categorias", icone: Tags },
        {
            href: "/promocoes",
            label: "Promoções",
            icone: Megaphone,
            exigeLojaAprovada: true,
        },
        { href: "/eventos", label: "Eventos", icone: Gift, exigeLojaAprovada: true },
        { href: "/missoes", label: "Missões", icone: Target, exigeLojaAprovada: true },
        {
            href: "/consumidores",
            label: "Consumidores",
            icone: Users,
            exigeLojaAprovada: true,
        },
    ],
    CONSUMIDOR: [
        { href: "/missao-consumidores", label: "Conclusões", icone: Trophy },
    ],
};

export function itensNavegacaoPorPapel(papel: PapelUsuario | null | undefined): ItemNavegacao[] {
    if (!papel || !(papel in NAV_POR_PAPEL)) {
        return [];
    }
    return NAV_POR_PAPEL[papel];
}

export function tituloPainelPorPapel(papel: PapelUsuario | null | undefined): string {
    switch (papel) {
        case "ASSOCIACAO":
            return "Painel da Associação";
        case "LOJISTA":
            return "Painel do Lojista";
        case "CONSUMIDOR":
            return "Painel do Consumidor";
        default:
            return "Conecta Comércio";
    }
}

/** Destino padrão por papel (lojista: /minha-loja; pós-login pode refinar por status). */
export function homePorPapel(papel: PapelUsuario | null | undefined): string {
    switch (papel) {
        case "ASSOCIACAO":
            return "/dashboard";
        case "LOJISTA":
            return "/minha-loja";
        case "CONSUMIDOR":
            return "/missao-consumidores";
        default:
            return "/login";
    }
}
