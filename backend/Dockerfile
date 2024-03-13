
FROM oven/bun:1 as base
WORKDIR /app
COPY . .
RUN bun install --production
EXPOSE 6231/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]