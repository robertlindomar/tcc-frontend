import { AvisoCanalConsumidorMobile } from "@/shared/components/acesso/AvisoCanalConsumidorMobile";
import { ExigirPapel } from "@/shared/components/acesso/ExigirPapel";

export default function Page() {
    return (
        <ExigirPapel papeis={["CONSUMIDOR"]}>
            <AvisoCanalConsumidorMobile />
        </ExigirPapel>
    );
}
