import { AvisoAcesso } from "./AvisoAcesso";

/** Consumidor usa o app mobile; painel web não é canal de produto (M3 demo). */
export function AvisoCanalConsumidorMobile() {
    return (
        <AvisoAcesso
            titulo="Use o aplicativo mobile"
            mensagem="O perfil de consumidor funciona no app Conecta Comércio (Android). Este painel web é exclusivo para associação e lojistas."
            tom="neutro"
        />
    );
}
