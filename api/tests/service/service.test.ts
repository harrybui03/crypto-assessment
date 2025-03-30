import { AppError } from '../../src/error/error';
import { ERROR_MESSAGES, ERROR_CODES } from '../../src/constant/error';
import { getCryptoMarketChart, getCryptoPrice, getPrice } from '../../src/service/service';
import { redisClient } from '../../src/redis/redis';
import { apiRequest } from '../../src/utils/app';
import { config } from '../../src/config/env';
import { getCachedDataOrThrow } from '../../src/utils/cache';

jest.mock('../../src/redis/redis');
jest.mock('../../src/utils/app');
jest.mock('../../src/utils/cache');
jest.mock('../../src/config/env');

describe('Crypto Service', () => {
  const mockRedisClient = {
    get: jest.fn(),
    setex: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (redisClient.getClient as jest.Mock).mockReturnValue(mockRedisClient);
    (config.api.resourceUrl as string) = 'https://api.example.com';
  });

  describe('getCryptoPrice', () => {
    const symbol = 'BTC';
    const mockPrice = { symbol: 'btc', price: 50000 };
    const mockPriceResponse = { btc: { usd: 50000 } };

    it('should return cached price when available', async () => {
      (getCachedDataOrThrow as jest.Mock).mockResolvedValue(mockPrice);

      const result = await getCryptoPrice(symbol);
      expect(result).toEqual(mockPrice);
      expect(getCachedDataOrThrow).toHaveBeenCalledWith(mockRedisClient, `crypto:price:${symbol.toLowerCase()}`);
    });

    it('should fetch from API when cache misses with 404', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({ success: true, data: mockPriceResponse });

      const result = await getCryptoPrice(symbol);
      expect(result).toEqual(mockPrice);
      expect(apiRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/simple/price',
        params: { ids: symbol, vs_currencies: 'usd' }
      });
      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        `crypto:price:${symbol.toLowerCase()}`,
        expect.any(Number),
        JSON.stringify(mockPrice)
      );
    });

    it('should throw non-404 cache errors', async () => {
      const cacheError = new AppError('Cache error', 500);
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(cacheError);

      await expect(getCryptoPrice(symbol)).rejects.toThrow(cacheError);
    });

    it('should throw API errors', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'API Error', code: 500, details: { reason: 'Invalid symbol' } }
      });

      await expect(getCryptoPrice(symbol)).rejects.toThrow(
        new AppError('API Error', 500, { apiError: { reason: 'Invalid symbol' } })
      );
    });

    it('should throw if price not found in response', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({ success: true, data: {} });

      await expect(getCryptoPrice(symbol)).rejects.toThrow(
        new AppError(ERROR_MESSAGES.NOT_FOUND.CRYPTO, ERROR_CODES.NOT_FOUND, { symbol })
      );
    });

    it('should handle unexpected errors', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(getCryptoPrice(symbol)).rejects.toThrow(
        new AppError(ERROR_MESSAGES.SERVER.INTERNAL, ERROR_CODES.INTERNAL_SERVER_ERROR, {
          originalError: 'Network error'
        })
      );
    });
  });

  describe('getCryptoMarketChart', () => {
    const symbol = 'BTC';
    const days = 7;
    const mockChart = {
      data: [
        { time: 1625097600000, price: 50000 },
        { time: 1625184000000, price: 51000 }
      ]
    };
    const mockApiResponse = {
      prices: [
        [1625097600000, 50000],
        [1625184000000, 51000]
      ]
    };

    it('should return cached chart when available', async () => {
      (getCachedDataOrThrow as jest.Mock).mockResolvedValue(mockChart);

      const result = await getCryptoMarketChart(symbol, days);
      expect(result).toEqual(mockChart);
      expect(getCachedDataOrThrow).toHaveBeenCalledWith(
        mockRedisClient,
        `crypto:history:${symbol.toLowerCase()}:${days}`
      );
    });

    it('should fetch from API when cache misses with 404', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({ success: true, data: mockApiResponse });

      const result = await getCryptoMarketChart(symbol, days);
      expect(result).toEqual({ data: mockChart.data });
      expect(apiRequest).toHaveBeenCalledWith({
        url: 'https://api.example.com/coins/BTC/market_chart',
        params: { vs_currency: 'usd', days }
      });
      expect(mockRedisClient.setex).toHaveBeenCalled();
    });

    it('should throw if API returns empty prices array', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({ success: true, data: { prices: [] } });

      await expect(getCryptoMarketChart(symbol, days)).rejects.toThrow(
        new AppError(ERROR_MESSAGES.NOT_FOUND.HISTORY, ERROR_CODES.NOT_FOUND, { symbol, days })
      );
    });

    it('should throw if API returns no prices data', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockResolvedValue({ success: true, data: {} });

      await expect(getCryptoMarketChart(symbol, days)).rejects.toThrow(
        new AppError(ERROR_MESSAGES.NOT_FOUND.HISTORY, ERROR_CODES.NOT_FOUND, { symbol, days })
      );
    });

    it('should handle unexpected errors', async () => {
      (getCachedDataOrThrow as jest.Mock).mockRejectedValue(new AppError('Not found', 404));
      (apiRequest as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(getCryptoMarketChart(symbol, days)).rejects.toThrow(
        new AppError(ERROR_MESSAGES.SERVER.INTERNAL, ERROR_CODES.INTERNAL_SERVER_ERROR, {
          originalError: 'Network error'
        })
      );
    });
  });

  describe('getPrice', () => {
    it('should return price when available', () => {
      const data = { btc: { usd: 50000 } };
      expect(getPrice(data, 'BTC')).toBe(50000);
    });

    it('should throw when price not found', () => {
      expect(() => getPrice({}, 'BTC')).toThrow(
        new AppError(ERROR_MESSAGES.NOT_FOUND.CRYPTO, ERROR_CODES.NOT_FOUND, { symbol: 'BTC' })
      );
    });

    it('should throw when data is undefined', () => {
      expect(() => getPrice(undefined, 'BTC')).toThrow(
        new AppError(ERROR_MESSAGES.NOT_FOUND.CRYPTO, ERROR_CODES.NOT_FOUND, { symbol: 'BTC' })
      );
    });
  });
});