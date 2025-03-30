import { AppError } from '../../src/error/error';
import { ERROR_CODES, ERROR_MESSAGES } from '../../src/constant/error';
import { validateAndParseDays } from '../../src/utils/utils';

describe('validateAndParseDays', () => {
  const fieldName = 'days';
  const min = 1;
  const max = 365;

  describe('successful validation', () => {
    it('should parse valid integer string', () => {
      const result = validateAndParseDays('30', fieldName, min, max);
      expect(result).toBe(30);
    });

    it('should accept minimum allowed value', () => {
      const result = validateAndParseDays(min.toString(), fieldName, min, max);
      expect(result).toBe(min);
    });

    it('should accept maximum allowed value', () => {
      const result = validateAndParseDays(max.toString(), fieldName, min, max);
      expect(result).toBe(max);
    });
  });

  describe('invalid input', () => {
    it('should throw for non-numeric string', () => {
      expect(() => validateAndParseDays('abc', fieldName, min, max))
        .toThrowError(AppError);

      try {
        validateAndParseDays('abc', fieldName, min, max);
      } catch (error: unknown) {
        if (error instanceof AppError) {
          expect(error.message).toBe(ERROR_MESSAGES.VALIDATION.INVALID_NUMBER);
          expect(error.statusCode).toBe(ERROR_CODES.BAD_REQUEST);
          expect(error.details).toEqual({
            field: 'day',
            received: 'abc'
          });
        } else {
          fail('Expected error to be an instance of AppError');
        }
      }
    });

    it('should throw for decimal numbers', () => {
      expect(() => validateAndParseDays('3.14', fieldName, min, max))
        .toThrowError(AppError);
    });

    it('should throw for empty string', () => {
      expect(() => validateAndParseDays('', fieldName, min, max))
        .toThrowError(AppError);
    });
  });

  describe('out of range values', () => {
    it('should throw for values below minimum', () => {
      expect(() => validateAndParseDays('0', fieldName, min, max))
        .toThrowError(AppError);

      try {
        validateAndParseDays('0', fieldName, min, max);
      } catch (error: unknown) {
        if (error instanceof AppError) {
          expect(error.details).toEqual({
            field: 'day',
            min,
            max,
            received: 0
          });
        } else {
          fail('Expected error to be an instance of AppError');
        }
      }
    });

    it('should throw for values above maximum', () => {
      expect(() => validateAndParseDays('366', fieldName, min, max))
        .toThrowError(AppError);
    });

    it('should use custom min/max values when provided', () => {
      const customMin = 5;
      const customMax = 10;

      expect(() => validateAndParseDays('4', fieldName, customMin, customMax))
        .toThrowError(AppError);

      expect(() => validateAndParseDays('11', fieldName, customMin, customMax))
        .toThrowError(AppError);

      expect(validateAndParseDays('7', fieldName, customMin, customMax))
        .toBe(7);
    });
  });

  describe('edge cases', () => {
    it('should handle string "0" when min is 0', () => {
      expect(validateAndParseDays('0', fieldName, 0, max)).toBe(0);
    });

    it('should handle very large numbers', () => {
      expect(() => validateAndParseDays('999999', fieldName, min, max))
        .toThrowError(AppError);
    });

    it('should throw for negative numbers', () => {
      expect(() => validateAndParseDays('-5', fieldName, min, max))
        .toThrowError(AppError);
    });
  });
});