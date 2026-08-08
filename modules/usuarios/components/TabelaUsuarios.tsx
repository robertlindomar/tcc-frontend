import { Usuario } from "../types/usuario.types";

interface TabelaUsuariosProps {
    usuarios: Usuario[];
    onEditar: (usuario: Usuario) => void;
    onExcluir: (usuario: Usuario) => void;
    carregando?: boolean;
    excluindoId?: number | null;
}

function formatarData(data: Date) {
    return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

const roleLabel: Record<Usuario["role"], string> = {
    ASSOCIACAO: "Associação",
    LOJISTA: "Lojista",
    CONSUMIDOR: "Consumidor",
};

export function TabelaUsuarios({
    usuarios,
    onEditar,
    onExcluir,
    carregando = false,
    excluindoId = null,
}: TabelaUsuariosProps) {
    return (
        <div className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[860px] text-sm">
                <thead className="bg-slate-100 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Nome</th>
                        <th className="px-4 py-3 text-left font-semibold">Email</th>
                        <th className="px-4 py-3 text-left font-semibold">Perfil</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Criação</th>
                        <th className="px-4 py-3 text-left font-semibold">Atualização</th>
                        <th className="px-4 py-3 text-right font-semibold">Ações</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 text-slate-800">
                    {carregando && (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                Carregando usuários...
                            </td>
                        </tr>
                    )}

                    {!carregando && usuarios.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                Nenhum usuário cadastrado.
                            </td>
                        </tr>
                    )}

                    {!carregando && usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3 font-medium">{usuario.nome}</td>
                            <td className="px-4 py-3">{usuario.email}</td>
                            <td className="px-4 py-3">{roleLabel[usuario.role]}</td>
                            <td className="px-4 py-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold ${usuario.ativo
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-slate-100 text-slate-600"
                                    }`}>
                                    {usuario.ativo ? "Ativo" : "Inativo"}
                                </span>
                            </td>
                            <td className="px-4 py-3">{formatarData(usuario.data_criacao)}</td>
                            <td className="px-4 py-3">{formatarData(usuario.data_atualizacao)}</td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    onClick={() => onEditar(usuario)}
                                    className="border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onExcluir(usuario)}
                                    disabled={excluindoId === usuario.id}
                                    className="ml-2 border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {excluindoId === usuario.id ? "Excluindo..." : "Excluir"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
