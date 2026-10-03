import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
});

redis.on('error', (err) => {
    console.log("Redis Client Error : ", err);
});

export { redis };