FROM node:18
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package*.json ./
RUN pnpm install

COPY . .

# CMD ["npm", "run", "dev"]
