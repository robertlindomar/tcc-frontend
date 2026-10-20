import { PainelPreCadastros } from "@/modules/lojistas/components/PainelPreCadastros";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ lojista?: string }>;
}) {
    const { lojista } = await searchParams;
    const lojistaId = Number(lojista);

    return (
        <ExigirPapel papeis={["ASSOCIACAO"]}>
            <PainelPreCadastros
                lojistaInicialId={Number.isInteger(lojistaId) ? lojistaId : undefined}
            />
        </ExigirPapel>
    );
}
