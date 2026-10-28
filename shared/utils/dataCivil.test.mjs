import { test } from "node:test";
import assert from "node:assert/strict";
import { DATA_MAXIMA_INPUT, ehDataIsoValida, hojeIsoCivil } from "./dataCivil.ts";

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
