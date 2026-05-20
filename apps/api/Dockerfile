FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/tool-configs/package.json ./packages/tool-configs/
COPY packages/ai-prompts/package.json ./packages/ai-prompts/
COPY packages/seo-utils/package.json ./packages/seo-utils/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --prod=false

FROM deps AS builder
WORKDIR /app
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN pnpm --filter @aifreetools/api run build
RUN cd apps/api && npx prisma generate

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nestjs

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

USER nestjs
EXPOSE 3001
ENV NODE_ENV=production

CMD ["node", "dist/main"]
