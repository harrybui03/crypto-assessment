import Redis from "ioredis";
import {config} from "../config/env";
import {ERROR_MESSAGES} from "../constant/error";

const redis = new Redis(config.redis.url, {
    tls: {
        rejectUnauthorized: false
    }
});

export const redisClient = {
    getClient: () => {
        if (!redis) {
            throw new Error(ERROR_MESSAGES.CACHE.CONNECTION_FAILED);
        }
        return redis;
    },
    isConnected: () => !!redis?.status,
    quit: async () => {
        if (redis) {
            await redis.quit();
        }
    }
};

export type RedisClient = typeof redisClient;