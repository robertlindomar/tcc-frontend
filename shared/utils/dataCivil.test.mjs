import { test } from "node:test";
import assert from "node:assert/strict";
import {
    DATA_MAXIMA_INPUT,
    dataMinimaPermitida,
    ehDataIsoValida,
    hojeIsoCivil,
    validarDataNaoPassada,
} from "./dataCivil.ts";

const agora = new Date("2026-10-27T15:00:00Z");

test("data mínima é hoje, ou a data salva se já venceu", () => {
    assert.equal(dataMinimaPermitida(null, agora), "2026-10-27");
    assert.equal(dataMinimaPermitida("2026-12-01", agora), "2026-10-27");
    assert.equal(dataMinimaPermitida("2026-09-30", agora), "2026-09-30");
});

test("validarDataNaoPassada cobre vazio, formato, passado e data salva", () => {
    const base = { rotulo: "validade", agora };
    assert.equal(validarDataNaoPassada("", base), null);
    assert.match(validarDataNaoPassada("", { ...base, obrigatorio: true }), /Informe/);
    assert.match(validarDataNaoPassada("123456-01-01", base), /4 dígitos/);
    assert.match(validarDataNaoPassada("2026-10-26", base), /anterior a hoje/);
    assert.equal(validarDataNaoPassada("2026-10-27", base), null);
    assert.equal(
        validarDataNaoPassada("2026-09-30", { ...base, valorOriginal: "2026-09-30" }),
        null,
    );
});

test("aceita apenas datas existentes com ano de 4 dígitos", () => {
    assert.equal(ehDataIsoValida("2026-01-01"), true);
    assert.equal(ehDataIsoValida("2028-02-29"), true);
    assert.equal(ehDataIsoValida("123456-01-01"), false);
    assert.equal(ehDataIsoValida("2026-02-30"), false);
    assert.equal(ehDataIsoValida(""), false);
});

test("hoje usa o fuso de São Paulo", () => {
    assert.equal(hojeIsoCivil(new Date("2026-10-28T02:00:00Z")), "2026-10-27");
    assert.equal(hojeIsoCivil(new Date("2026-10-28T03:00:00Z")), "2026-10-28");
});

test("comparação textual de datas respeita a ordem cronológica", () => {
    assert.equal("2026-10-26" < "2026-10-27", true);
    assert.equal("2027-01-01" < "2026-12-31", false);
    assert.equal(DATA_MAXIMA_INPUT, "9999-12-31");
});
