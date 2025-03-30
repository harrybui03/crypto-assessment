import {AppError} from "../error/error";
import {ERROR_CODES, ERROR_MESSAGES} from "../constant/error";

export const validateAndParseDays = (
    input: string,
    fieldName: string,
    min = 1,
    max = 365
): number => {
    if (!/^\d+$/.test(input)) {
        throw new AppError(
            ERROR_MESSAGES.VALIDATION.INVALID_NUMBER,
            ERROR_CODES.BAD_REQUEST,
            { field: 'day', received: input }
        );
    }

    const number = parseInt(input, 10);

    if (number < min || number > max) {
        throw new AppError(
            ERROR_MESSAGES.VALIDATION.NUMBER_OUT_OF_RANGE,
            ERROR_CODES.BAD_REQUEST,
            {
                field: 'day',
                min,
                max,
                received: number
            }
        );
    }

    return number;
};