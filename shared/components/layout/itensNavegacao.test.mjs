import { test } from "node:test";
import assert from "node:assert/strict";
import { itensNavegacaoPorPapel } from "./itensNavegacao.ts";

test("associação não tem mais item Sorteios; sorteio vive na campanha", () => {
    const hrefs = itensNavegacaoPorPapel("ASSOCIACAO").map((item) => item.href);
    assert.ok(hrefs.includes("/campanhas"));
    assert.ok(!hrefs.includes("/sorteios"));
});
