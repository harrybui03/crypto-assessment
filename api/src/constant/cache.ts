export const CACHE_EXPIRATION = {
    CRYPTO_PRICE: 60,
    CRYPTO_MARKET_CHART: 3600,
} as const;

export type CacheExpiration = typeof CACHE_EXPIRATION;