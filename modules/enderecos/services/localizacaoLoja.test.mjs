import { test } from "node:test";
import assert from "node:assert/strict";
import { obterLocalizacaoLoja } from "./localizacaoLoja.ts";

test("HTTP inseguro explica o bloqueio antes de solicitar localização", async () => {
    await assert.rejects(obterLocalizacaoLoja({ contextoSeguro: false, geolocalizacao: {
        getCurrentPosition() { assert.fail("Não deve solicitar GPS em HTTP inseguro"); },
    } }), /HTTPS.*localhost/);
});

test("navegador sem localização permite preenchimento manual", async () => {
    await assert.rejects(obterLocalizacaoLoja({ contextoSeguro: true }), /não oferece localização/);
});

test("retorna as coordenadas do dispositivo, inclusive zero", async () => {
    const coordenadas = await obterLocalizacaoLoja({ contextoSeguro: true, geolocalizacao: {
        getCurrentPosition(sucesso, erro, opcoes) {
            assert.equal(opcoes.enableHighAccuracy, true);
            assert.ok(opcoes.timeout > 0);
            sucesso({ coords: { latitude: 0, longitude: -50.927 } });
        },
    } });
    assert.deepEqual(coordenadas, { latitude: 0, longitude: -50.927 });
});

for (const [codigo, mensagem] of [[1, /Permita a localização/], [2, /dispositivo não conseguiu/], [3, /demorou para responder/], [99, /Não foi possível/]]) {
    test(`erro de localização ${codigo} apresenta orientação adequada`, async () => {
        await assert.rejects(obterLocalizacaoLoja({ contextoSeguro: true, geolocalizacao: {
            getCurrentPosition(sucesso, falha) { falha({ code: codigo }); },
        } }), mensagem);
    });
}
