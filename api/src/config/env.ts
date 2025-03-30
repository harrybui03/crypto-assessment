import dotenv from "dotenv";
import { z } from "zod";
import * as process from 'process';
dotenv.config();

const envSchema = z.object({
    RESOURCE_API_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    PORT: z.coerce.number().default(3000),

});

const env = envSchema.safeParse(process.env);

if (!env.success) {
    console.error("Invalid environment variables:", env.error.format());
    process.exit(1);
}

export const config = {
    api: {
        resourceUrl: env.data.RESOURCE_API_URL,
    },
    redis: {
        url: env.data.REDIS_URL,
        isEnabled: !!env.data.REDIS_URL,
    },
    server: {
        port: env.data.PORT,
    },
};

export type Config = typeof config;