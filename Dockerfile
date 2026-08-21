FROM node:22-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Coolify: marque NEXT_PUBLIC_API_URL como Build Variable (URL pública HTTPS da API)
ARG NEXT_PUBLIC_API_URL=http://localhost:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production
# Coolify injeta PORT — não fixe 3001 no CMD
ENV PORT=3001
ENV HOSTNAME=0.0.0.0
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD curl -fsS http://127.0.0.1:3001/ || exit 1

CMD ["sh", "-c", "npx next start -H 0.0.0.0 -p ${PORT:-3001}"]
