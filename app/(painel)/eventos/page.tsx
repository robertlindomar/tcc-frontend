import { CrudEventos } from "@/modules/eventos/components/CrudEventos";
import { ExigirLojaAprovada } from "@/shared/components/acesso/ExigirLojaAprovada";

export default function Page() {
    return (
        <ExigirLojaAprovada recurso="os eventos">
            <CrudEventos />
        </ExigirLojaAprovada>
    );
}
