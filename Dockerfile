FROM oven/bun:1.2.14

WORKDIR /app

COPY bun.lock package.json tsconfig.json ./

RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "src/app.ts"]