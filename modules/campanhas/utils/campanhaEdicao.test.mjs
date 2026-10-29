import { test } from "node:test";
import assert from "node:assert/strict";
import {
    acoesCampanha,
    campoDoErroCampanha,
    descreverRiscoExclusao,
    formatarCivilBr,
    MENSAGENS_ERRO_CAMPANHA,
    mensagemErroCampanha,
    ROTULO_SITUACAO_SORTEIO,
    rotuloStatusCampanha,
} from "./campanhaEdicao.ts";

const base = { ativa: true, periodoEncerrado: false, situacaoSorteio: "AGUARDANDO_ENCERRAMENTO", dataFimCivil: "2031-01-20" };

test("sortear só fica disponível depois do fim, com o motivo dd/mm/aaaa", () => {
    const antes = acoesCampanha(base);
    assert.equal(antes.podeSortear, false);
    assert.equal(antes.motivoSortear, "Disponível após 20/01/2031");

    const pronto = acoesCampanha({ ...base, periodoEncerrado: true, situacaoSorteio: "PRONTO_PARA_SORTEAR" });
    assert.equal(pronto.podeSortear, true);
    assert.equal(pronto.motivoSortear, null);

    const semTickets = acoesCampanha({ ...base, periodoEncerrado: true, situacaoSorteio: "SEM_TICKETS" });
    assert.equal(semTickets.podeSortear, false);
    assert.equal(semTickets.motivoSortear, "Sem tickets para sortear");
});

test("inativar só para ativa; reativar exige inativa, período encerrado e sorteio feito", () => {
    assert.deepEqual(
        [acoesCampanha(base).podeInativar, acoesCampanha(base).podeReativar],
        [true, false],
    );

    const inativaVigente = acoesCampanha({ ...base, ativa: false });
    assert.equal(inativaVigente.podeReativar, false);
    assert.match(inativaVigente.motivoReativar, /termina em 20\/01\/2031/);

    const sorteioPendente = acoesCampanha({ ...base, ativa: false, periodoEncerrado: true, situacaoSorteio: "PRONTO_PARA_SORTEAR" });
    assert.equal(sorteioPendente.podeReativar, false);
    assert.match(sorteioPendente.motivoReativar, /sorteio/);

    for (const situacaoSorteio of ["SEM_TICKETS", "AGUARDANDO_ENTREGA", "ENTREGUE"]) {
        const liberada = acoesCampanha({ ...base, ativa: false, periodoEncerrado: true, situacaoSorteio });
        assert.equal(liberada.podeReativar, true, situacaoSorteio);
        assert.equal(liberada.podeInativar, false);
    }
});

test("status da campanha", () => {
    assert.equal(rotuloStatusCampanha({ ativa: true, periodoEncerrado: false }), "Ativa");
    assert.equal(rotuloStatusCampanha({ ativa: true, periodoEncerrado: true }), "Encerrada");
    assert.equal(rotuloStatusCampanha({ ativa: false, periodoEncerrado: true }), "Inativa");
});

test("toda situação de sorteio tem rótulo", () => {
    for (const situacao of ["AGUARDANDO_ENCERRAMENTO", "PRONTO_PARA_SORTEAR", "SEM_TICKETS", "AGUARDANDO_ENTREGA", "ENTREGUE"]) {
        assert.ok(ROTULO_SITUACAO_SORTEIO[situacao], situacao);
    }
});

test("mensagens específicas por código da API", () => {
    for (const codigo of [
        "CAMPANHA_NOME_DUPLICADO",
        "CAMPANHA_PERIODO_OCUPADO",
        "CAMPANHA_EDICAO_EM_USO",
        "CAMPANHA_AINDA_VIGENTE",
        "SORTEIO_PENDENTE",
        "OPERACAO_CONCORRENTE",
        "CAMPANHA_COM_TICKETS",
        "CAMPANHA_COM_HISTORICO",
        "CAMPANHA_NAO_ENCERRADA",
    ]) {
        assert.equal(mensagemErroCampanha(codigo), MENSAGENS_ERRO_CAMPANHA[codigo]);
    }
    assert.equal(mensagemErroCampanha("DESCONHECIDO"), null);
    assert.equal(mensagemErroCampanha(null), null);
});

test("erros da API apontam para o campo do formulário", () => {
    assert.equal(campoDoErroCampanha("CAMPANHA_NOME_DUPLICADO"), "nome");
    assert.equal(campoDoErroCampanha("CAMPANHA_PERIODO_OCUPADO"), "periodo");
    assert.equal(campoDoErroCampanha("CAMPANHA_EDICAO_EM_USO"), "periodo");
    assert.equal(campoDoErroCampanha("CAMPANHA_AINDA_VIGENTE"), "periodo");
    assert.equal(campoDoErroCampanha("SORTEIO_PENDENTE"), null);
    assert.equal(campoDoErroCampanha(null), null);
});

test("aviso de risco lista o que será apagado", () => {
    assert.deepEqual(descreverRiscoExclusao({ totalTickets: 114, totalNotas: 1, totalResultados: 2 }), [
        "114 tickets dos consumidores",
        "1 nota fiscal registrada",
        "2 resultados de sorteio (vencedores e avisos no app)",
    ]);
    assert.deepEqual(descreverRiscoExclusao({ totalTickets: 0, totalNotas: 3, totalResultados: 0 }), [
        "3 notas fiscais registradas",
    ]);
});

test("formatarCivilBr", () => {
    assert.equal(formatarCivilBr("2031-12-05"), "05/12/2031");
    assert.equal(formatarCivilBr("invalido"), "invalido");
});
