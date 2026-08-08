// src/modules/usuarios/mocks/usuarios.mock.ts

import { Usuario } from "../types/usuario.types";

export const usuariosMock: Usuario[] = [
    {
        id: 1,
        nome: "Robert",
        email: "robert@gmail.com",
        senha: "123456",
        role: "CONSUMIDOR",
        ativo: true,
        data_criacao: new Date("2024-01-01T10:00:00Z"),
        data_atualizacao: new Date("2024-01-10T15:30:00Z"),
    },
    {
        id: 2,
        nome: "Maria Silva",
        email: "maria@gmail.com",
        senha: "123456",
        role: "LOJISTA",
        ativo: true,
        data_criacao: new Date("2024-01-02T11:00:00Z"),
        data_atualizacao: new Date("2024-01-11T16:30:00Z"),
    },
    {
        id: 3,
        nome: "João Santos",
        email: "joao@gmail.com",
        senha: "123456",
        role: "ASSOCIACAO",
        ativo: false,
        data_criacao: new Date("2024-01-03T12:00:00Z"),
        data_atualizacao: new Date("2024-01-12T17:30:00Z"),
    },
];
