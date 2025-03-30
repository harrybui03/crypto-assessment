export const ERROR_MESSAGES = {
    CACHE: {
        CONNECTION_FAILED: "Failed to connect to cache service",
        NOT_FOUND: "not found",
        INVALID_DATA: "invalid data"
    },
    VALIDATION: {
        INVALID_NUMBER: "{field} must be a positive integer",
        NUMBER_OUT_OF_RANGE: "{field} must be between {min} and {max}",
        SYMBOL_REQUIRED: "Symbol is required"
    },
    NOT_FOUND: {
        CRYPTO: "Cryptocurrency not found",
        HISTORY: "Cryptocurrency history not found",
    },
    SERVER: {
        INTERNAL: "Internal server error",
        PRICE_FETCH: "Failed to fetch price data",
        HISTORY_FETCH: "Failed to fetch historical data",
    },
    API: {
        BAD_REQUEST: 'Invalid request parameters',
        RATE_LIMITED: 'API rate limit exceeded',
        NOT_FOUND: 'Requested resource not found',
        SERVER_ERROR: 'Internal server error',
        NETWORK_ERROR: 'Network connection failed',
        FORBIDDEN: "Forbidden"
    },

} as const;

export const ERROR_CODES = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
    TOO_MANY_REQUESTS: 429
} as const;