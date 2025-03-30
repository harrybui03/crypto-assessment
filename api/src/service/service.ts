import type { Price, HistoryChart, HistoryChartElement, PriceResponse } from '../dto/dto';
import { config } from "../config/env";
import { redisClient } from "../redis/redis";
import {CACHE_EXPIRATION} from "../constant/cache";
import {getCachedDataOrThrow} from "../utils/cache";
import {AppError} from "../error/error";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";
import {apiRequest} from "../utils/app";

export async function getCryptoPrice(symbol: string): Promise<Price | null> {
    const cacheKey = `crypto:price:${symbol.toLowerCase()}`;

    try {
        const cachedPrice = await getCachedDataOrThrow<Price>(redisClient.getClient(), cacheKey);
        return cachedPrice;
    } catch (cacheError) {
        if (!(cacheError instanceof AppError) || cacheError.statusCode !== 404) {
            throw cacheError;
        }
    }

    try {
        const {success, data, error} = await apiRequest<PriceResponse>({
            url: `${config.api.resourceUrl}/simple/price`,
            params: {
                ids: symbol,
                vs_currencies: 'usd'
            },
        });

        if (!success) {
            const {
                message = ERROR_MESSAGES.API.SERVER_ERROR,
                code = ERROR_CODES.INTERNAL_SERVER_ERROR,
                details
            } = error ?? {};

            throw new AppError(message, code, { apiError: details }
            );
        }
        const price = getPrice(data, symbol);
        const priceData:Price = {
            symbol: symbol.toLowerCase(),
            price,
        };

        await redisClient.getClient().setex(
          cacheKey,
          CACHE_EXPIRATION.CRYPTO_PRICE,
          JSON.stringify(priceData)
        );

        return priceData;
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

export async function getCryptoMarketChart(
    symbol: string,
    days: number
): Promise<HistoryChart | null> {
    const cacheKey = `crypto:history:${symbol.toLowerCase()}:${days}`;
    try {
        const cachedChart = await getCachedDataOrThrow<HistoryChart>(redisClient.getClient(), cacheKey);
        return cachedChart;
    } catch (cacheError) {
        if (!(cacheError instanceof AppError) || cacheError.statusCode !== 404) {
            throw cacheError;
        }
    }

    try {
        const {success, data, error} = await apiRequest<{ prices: [number , number][] }>({
            url: `${config.api.resourceUrl}/coins/${symbol}/market_chart`,
            params: { vs_currency: 'usd', days },
        });

        if (!success) {
            const {
                message = ERROR_MESSAGES.API.SERVER_ERROR,
                code = ERROR_CODES.INTERNAL_SERVER_ERROR,
                details
            } = error ?? {};

            throw new AppError(
              message,
              code,
              { apiError: details }
            );
        }
        if (!data || !data.prices) {
            throw new AppError(
              ERROR_MESSAGES.NOT_FOUND.HISTORY,
              ERROR_CODES.NOT_FOUND,
              { symbol, days }
            );
        }

        const { prices } = data;

        if (!prices.length) {
            throw new AppError(
              ERROR_MESSAGES.NOT_FOUND.HISTORY,
              ERROR_CODES.NOT_FOUND,
              { symbol, days }
            );
        }

        const historyChart: HistoryChart = {
           data: prices.map(([time , price]) => {
               return {
                   time: time,
                   price: price
               }
           })
        };

        await redisClient.getClient().setex(
          cacheKey,
          CACHE_EXPIRATION.CRYPTO_MARKET_CHART,
          JSON.stringify(historyChart)
        );

        return historyChart;
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

export function getPrice(data: PriceResponse | undefined, symbol: string): number {
    const price = data?.[symbol.toLowerCase()]?.usd;
    if (price === undefined) {
        throw new AppError(
          ERROR_MESSAGES.NOT_FOUND.CRYPTO,
          ERROR_CODES.NOT_FOUND,
          { symbol }
        );
    }
    return price;
}