import { ERROR_CODES, ERROR_MESSAGES } from '../constant/error';
import { AppError } from '../error/error';

interface CacheClient {
    get(key: string): Promise<string | null>;
}

export async function getCachedDataOrThrow<T>(
  cacheClient: CacheClient,
  cacheKey: string
): Promise<T> {
    const cachedData = await cacheClient.get(cacheKey);
    if (!cachedData) {
        throw new AppError(
          ERROR_MESSAGES.CACHE.NOT_FOUND,
          ERROR_CODES.NOT_FOUND,
          { cacheKey }
        );
    }

    try {
        return JSON.parse(cachedData) as T;
    } catch (error) {
        if (error instanceof AppError) throw error;

        throw new AppError(
          ERROR_MESSAGES.SERVER.INTERNAL,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          {
              originalError: error instanceof Error ? error.message : String(error)
          }
        );
    }
}