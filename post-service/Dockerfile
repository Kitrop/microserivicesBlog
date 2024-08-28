FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install pm2

RUN pnpm install

RUN pnpm install express

COPY . .

RUN pnpm build

RUN pnpm prisma generate

EXPOSE 3001

CMD ["pnpm", "pm2", "dist/main.js", "--name", "post_service"]