import { obterCodigoErroApi, obterMensagemErroApi } from "@/shared/utils/erroApi";
import { campoDoErroCampanha, CampoFormCampanha, mensagemErroCampanha } from "./campanhaEdicao";

/** Mensagem amigável: primeiro pelo `codigo` de negócio, depois pelo texto da API. */
export function obterMensagemErroCampanha(error: unknown, fallback: string): string {
    return mensagemErroCampanha(obterCodigoErroApi(error)) ?? obterMensagemErroApi(error, fallback);
}

export type ErroFormCampanha = { campo: CampoFormCampanha | null; mensagem: string };

/** Erro da API já associado ao campo do formulário que o causou. */
export function obterErroFormCampanha(error: unknown, fallback: string): ErroFormCampanha {
    return {
        campo: campoDoErroCampanha(obterCodigoErroApi(error)),
        mensagem: obterMensagemErroCampanha(error, fallback),
    };
}
