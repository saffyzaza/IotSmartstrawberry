# Stage 1: Install dependencies
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# คัดลอกไฟล์ package เพื่อติดตั้ง dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder - Build โปรเจกต์
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# สั่ง Build Next.js (ต้องมีการตั้งค่า output: 'standalone' ใน next.config.js)
RUN npm run build

# Stage 3: Runner - รันแอปพลิเคชัน
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# สร้าง user ใหม่เพื่อความปลอดภัย (ไม่รันด้วย root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# คัดลอกไฟล์ที่จำเป็นจาก stage builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]