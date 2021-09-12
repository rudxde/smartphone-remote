export const env = {
    port: process.env.port || 8080,
    redis_url: process.env.redis_url || "localhost",
    redis_port: process.env.redis_port ? Number(process.env.redis_port) : 6379
}