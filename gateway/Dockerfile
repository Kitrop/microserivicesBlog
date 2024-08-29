FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install pm2

RUN pnpm install

RUN pnpm install express

COPY . .

RUN pnpm build

EXPOSE 3000

#CMD ["pnpm", "start:prod"]
