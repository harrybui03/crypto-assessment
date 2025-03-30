import type { Response } from "express";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number,
        public details?: unknown
    ) {
        super(message);
    }
}

export const handleError = (err: unknown, res: Response) => {
    if (err instanceof AppError) {
        const response: {
            message: string;
            details?: unknown;
        } = {
            message: err.message
        };

        if (err.details) {
            response.details = err.details;
        }

        return res.status(err.statusCode).json(response);
    }

    return res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({
        message: ERROR_MESSAGES.SERVER.INTERNAL,
    });
};