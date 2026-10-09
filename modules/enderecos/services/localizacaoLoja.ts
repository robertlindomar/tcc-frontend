type AmbienteLocalizacao = {
    contextoSeguro: boolean;
    geolocalizacao?: Pick<Geolocation, "getCurrentPosition">;
};

export function obterLocalizacaoLoja({ contextoSeguro, geolocalizacao }: AmbienteLocalizacao): Promise<{ latitude: number; longitude: number }> {
    if (!contextoSeguro) {
        return Promise.reject(new Error("O navegador bloqueia a localização em páginas HTTP abertas pelo IP. Abra o painel por HTTPS ou, neste computador, por localhost. Você também pode informar as coordenadas abaixo."));
    }
    if (!geolocalizacao) {
        return Promise.reject(new Error("Este navegador não oferece localização. Informe as coordenadas abaixo."));
    }
    return new Promise((resolver, rejeitar) => {
        geolocalizacao.getCurrentPosition(posicao => resolver({
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
        }), erro => {
            const mensagens: Record<number, string> = {
                1: "O acesso à localização foi bloqueado. Permita a localização nas configurações deste site no navegador e tente novamente.",
                2: "O dispositivo não conseguiu determinar sua localização. Confira se a localização está ativada e tente novamente ou informe as coordenadas abaixo.",
                3: "A localização demorou para responder. Tente novamente ou informe as coordenadas abaixo.",
            };
            rejeitar(new Error(mensagens[erro.code] ?? "Não foi possível obter a localização. Tente novamente ou informe as coordenadas abaixo."));
        }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 });
    });
}
