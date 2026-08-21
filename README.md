# tcc-frontend

Front Next.js do Conecta Comércio.

## Dev local

Porta **3001** (API local em **3000**):

```bash
# .env.local — NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev
```

Abra [http://localhost:3001](http://localhost:3001).

## Docker / Coolify

No container a porta padrão é **3000** (compatível com Coolify `ports_exposes`).

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.seudominio.com -t tcc-front .
docker run --rm -p 3000:3000 tcc-front
```

### Coolify

- Build Pack: **Dockerfile**
- Ports Exposes: `3000` (igual ao `PORT`)
- Env:

| Key | Build? | Valor |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | **sim** | URL pública HTTPS da API |
| `NEXT_PUBLIC_USAR_MOCK` | opcional | `false` |
| `PORT` | não | `3000` |

`NEXT_PUBLIC_*` entra no bundle no **build**. Se mudar a URL da API, precisa **rebuild**.
