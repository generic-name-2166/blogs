FROM node:22-alpine AS builder
LABEL stage="builder"

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build


FROM caddy:2.9-alpine AS runner

WORKDIR /app

COPY Caddyfile ./Caddyfile
COPY --from=builder /app/dist ./dist

EXPOSE 8443

ENTRYPOINT [ "caddy", "run" ]
