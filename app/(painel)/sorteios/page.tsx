import { redirect } from "next/navigation";

/** Sorteio agora vive dentro da campanha (um por edição); rota antiga preservada para links salvos. */
export default function Page() {
    redirect("/campanhas");
}
