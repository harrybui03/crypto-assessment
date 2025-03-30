import type { AxiosError, AxiosResponse } from 'axios';
import axios, { AxiosHeaders } from 'axios';
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";

interface ApiResponse<T> {
    success: boolean;
    data?:T;
    error?: {
        message: string;
        code: number;
        details?: unknown;
    };
}

const createErrorResponse = (message: string, code: number) => ({
    success: false,
    error: { message, code }
});

export async function apiRequest<T>(
    config: {
        url: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        params?: any;
    }
): Promise<ApiResponse<T>> {
    try {
        const response: AxiosResponse<T> = await axios({
            method: config.method ?? 'get',
            url: config.url,
            params: config.params
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
            switch (axiosError.response.status) {
                case 400: return createErrorResponse(ERROR_MESSAGES.API.BAD_REQUEST, ERROR_CODES.BAD_REQUEST);
                case 403: return createErrorResponse(ERROR_MESSAGES.API.RATE_LIMITED, ERROR_CODES.FORBIDDEN);
                case 404: return createErrorResponse(ERROR_MESSAGES.API.NOT_FOUND, ERROR_CODES.NOT_FOUND);
                case 429: return createErrorResponse(ERROR_MESSAGES.API.RATE_LIMITED, ERROR_CODES.TOO_MANY_REQUESTS);
                default: return createErrorResponse(ERROR_MESSAGES.API.SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR);
            }
        }

        return createErrorResponse(ERROR_MESSAGES.API.NETWORK_ERROR, ERROR_CODES.SERVICE_UNAVAILABLE);
    }
}