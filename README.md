# tcc-frontend

Front Next.js do Conecta Comércio (porta **3001**).

## Dev local

```bash
# .env.local — NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001).

## Docker local

Stack completa na raiz do TCC:

```bash
docker compose up --build
```

Só o front (API já no ar):

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000 -t tcc-front .
docker run --rm -p 3001:3001 tcc-front
```

## Coolify (VM)

- Build Pack: **Dockerfile**
- Base Directory: `front`
- Dockerfile: `Dockerfile`
- Ports Exposes: `3001`
- Env / Build Variable:

| Key | Build? | Valor |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **sim** | `https://api.seudominio.com` (URL pública da API) |
| `PORT` | não | `3001` |

`NEXT_PUBLIC_*` entra no bundle no **build**. Se mudar a URL da API, precisa **rebuild**.
