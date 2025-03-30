import { getCachedDataOrThrow } from '../../src/utils/cache';
import { AppError } from '../../src/error/error';
import { ERROR_CODES, ERROR_MESSAGES } from '../../src/constant/error';
import * as redisClientModule from '../../src/redis/redis';

interface CacheClient {
  get(key: string): Promise<string | null>;
}

jest.mock('../../src/redis/redis', () => ({
  redisClient: {
    getClient: jest.fn(),
    isConnected: jest.fn(),
    quit: jest.fn(),
  },
}));

describe('getCachedDataOrThrow', () => {
  let mockCacheClient: jest.Mocked<CacheClient>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCacheClient = {
      get: jest.fn(),
    };
    (redisClientModule.redisClient.getClient as jest.Mock).mockReturnValue(mockCacheClient);
  });

  it('should return parsed data when valid JSON is cached', async () => {
    const cacheKey = 'test:key';
    const mockData = { foo: 'bar' };
    mockCacheClient.get.mockResolvedValue(JSON.stringify(mockData));

    const result = await getCachedDataOrThrow(redisClientModule.redisClient.getClient(), cacheKey);

    expect(mockCacheClient.get).toHaveBeenCalledWith(cacheKey);
    expect(result).toEqual(mockData);
  });

  it('should throw AppError with NOT_FOUND when no cached data exists', async () => {
    const cacheKey = 'test:key';
    mockCacheClient.get.mockResolvedValue(null);

    await expect(getCachedDataOrThrow(redisClientModule.redisClient.getClient(), cacheKey)).rejects.toThrow(
      new AppError(
        ERROR_MESSAGES.CACHE.NOT_FOUND,
        ERROR_CODES.NOT_FOUND,
        { cacheKey }
      )
    );
    expect(mockCacheClient.get).toHaveBeenCalledWith(cacheKey);
  });

  it('should throw AppError with INTERNAL_SERVER_ERROR when JSON parsing fails', async () => {
    const cacheKey = 'test:key';
    const invalidJson = 'invalid json string';
    mockCacheClient.get.mockResolvedValue(invalidJson);

    await expect(getCachedDataOrThrow(redisClientModule.redisClient.getClient(), cacheKey)).rejects.toThrow(
      new AppError(
        ERROR_MESSAGES.SERVER.INTERNAL,
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        expect.objectContaining({
          originalError: expect.any(String)
        })
      )
    );
    expect(mockCacheClient.get).toHaveBeenCalledWith(cacheKey);
  });

  it('should preserve AppError if thrown during parsing', async () => {
    const cacheKey = 'test:key';
    const customError = new AppError('Custom error', 400);
    mockCacheClient.get.mockResolvedValue('some data');

    jest.spyOn(JSON, 'parse').mockImplementation(() => {
      throw customError;
    });

    await expect(getCachedDataOrThrow(redisClientModule.redisClient.getClient(), cacheKey)).rejects.toThrow(customError);
    expect(mockCacheClient.get).toHaveBeenCalledWith(cacheKey);
  });

  it('should handle different data types correctly', async () => {
    const cacheKey = 'test:key';
    const testCases = [
      { input: 42, expected: 42 },
      { input: 'test', expected: 'test' },
      { input: [1, 2, 3], expected: [1, 2, 3] },
    ];

    for (const { input, expected } of testCases) {
      mockCacheClient.get.mockResolvedValue(JSON.stringify(input));
      const result = await getCachedDataOrThrow(redisClientModule.redisClient.getClient(), cacheKey);
      expect(result).toEqual(expected);
    }
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
});