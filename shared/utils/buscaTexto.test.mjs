import { test } from "node:test";
import assert from "node:assert/strict";
import {
    correspondeBusca,
    formatarCnpj,
    mascararCnpj,
    normalizarTextoBusca,
    rotularContagem,
} from "./buscaTexto.ts";

const loja = {
    textos: ["Ótica Visão", "Ótica Visão LTDA"],
    documentos: ["38281946000146"],
};
const lojaDemo = {
    textos: ["Padaria Pão da Praça (Demo)"],
    documentos: ["99.000.801/0001-14"],
};

test("normaliza acentos, caixa e espaços", () => {
    assert.equal(normalizarTextoBusca("  ÓTICA   Visão "), "otica visao");
    assert.equal(normalizarTextoBusca(null), "");
});

test("busca vazia corresponde a tudo", () => {
    assert.equal(correspondeBusca("   ", loja), true);
});

test("encontra nome sem acento e em qualquer ordem", () => {
    assert.equal(correspondeBusca("otica", loja), true);
    assert.equal(correspondeBusca("VISAO otica", loja), true);
    assert.equal(correspondeBusca("pao praca", lojaDemo), true);
    assert.equal(correspondeBusca("otica", lojaDemo), false);
});

test("encontra CNPJ com ou sem pontuação", () => {
    assert.equal(correspondeBusca("38281946000146", loja), true);
    assert.equal(correspondeBusca("38.281.946", loja), true);
    assert.equal(correspondeBusca("99000801", lojaDemo), true);
    assert.equal(correspondeBusca("99.000", lojaDemo), true);
    assert.equal(correspondeBusca("123", lojaDemo), false);
});

test("números não casam com campos sem documento", () => {
    assert.equal(correspondeBusca("99", { textos: ["Loja"] }), false);
});

test("máscara de CNPJ progressiva e limitada a 14 dígitos", () => {
    assert.equal(mascararCnpj("38281"), "38.281");
    assert.equal(mascararCnpj("38281946"), "38.281.946");
    assert.equal(mascararCnpj("382819460001"), "38.281.946/0001");
    assert.equal(mascararCnpj("38281946000146999"), "38.281.946/0001-46");
    assert.equal(mascararCnpj("38a28"), "38.28");
});

test("formatar CNPJ preserva valores inválidos", () => {
    assert.equal(formatarCnpj("38281946000146"), "38.281.946/0001-46");
    assert.equal(formatarCnpj("99.000.801/0001-14"), "99.000.801/0001-14");
    assert.equal(formatarCnpj("123"), "123");
});

test("rótulo de contagem no singular e plural", () => {
    assert.equal(rotularContagem(1, "produto", "produtos"), "1 produto");
    assert.equal(rotularContagem(3, "produto", "produtos"), "3 produtos");
});
