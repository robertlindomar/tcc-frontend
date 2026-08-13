import { ExigirAutenticacao } from "@/modules/auth/components/ExigirAutenticacao";
import { AvisoAcesso } from "@/shared/components/acesso/AvisoAcesso";
import { LayoutAutenticado } from "@/shared/components/layout/LayoutAutenticado";

/**
 * Listagem global de usuários foi encerrada no backend (GET /usuario responde
 * 403 para todos os papéis). A rota permanece apenas para explicar isso, sem
 * chamar a API.
 */
export default function Page() {
    return (
        <ExigirAutenticacao>
            <LayoutAutenticado>
                <AvisoAcesso
                    titulo="Administração de usuários indisponível"
                    mensagem="A listagem global de usuários não faz parte do sistema. Cada usuário acessa apenas os próprios dados, e o cadastro é feito na tela de cadastro."
                    tom="neutro"
                />
            </LayoutAutenticado>
        </ExigirAutenticacao>
    );
}
