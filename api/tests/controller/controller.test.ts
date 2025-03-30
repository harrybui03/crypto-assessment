import { Request, Response } from "express";
import { getCryptoMarketChart, getCryptoPrice } from '../../src/service/service';
import { getHistoryHandler, getPriceHandler } from '../../src/controller/controller';
import { ERROR_CODES, ERROR_MESSAGES } from '../../src/constant/error';
import { validateAndParseDays } from '../../src/utils/utils';

jest.mock('../../src/service/service');
jest.mock('../../src/utils/utils');

describe("Crypto Controller", () => {
  const createMockResponse = () => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const createMockRequest = (params: any = {}) => ({
    params
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPriceHandler", () => {
    it("should return price successfully for valid symbol", async () => {
      const mockPrice = { symbol: "btc", price: 50000 };
      const req = createMockRequest({ symbol: "BTC" });
      const res = createMockResponse();
      (getCryptoPrice as jest.Mock).mockResolvedValue(mockPrice);

      await getPriceHandler(req as Request, res as Response);

      expect(getCryptoPrice).toHaveBeenCalledWith("btc");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPrice);
    });

    it("should return 400 when symbol is missing", async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await getPriceHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.VALIDATION.SYMBOL_REQUIRED
      });
      expect(getCryptoPrice).not.toHaveBeenCalled();
    });

    it("should return 404 when crypto not found", async () => {
      const req = createMockRequest({ symbol: "BTC" });
      const res = createMockResponse();
      (getCryptoPrice as jest.Mock).mockResolvedValue(null);

      await getPriceHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.NOT_FOUND.CRYPTO
      });
    });

    it("should handle service errors", async () => {
      const req = createMockRequest({ symbol: "BTC" });
      const res = createMockResponse();
      const error = new Error("Service error");
      (getCryptoPrice as jest.Mock).mockRejectedValue(error);

      await getPriceHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.SERVER.INTERNAL
      });
    });
  });

  describe("getHistoryHandler", () => {
    it("should return history successfully for valid input", async () => {
      const mockHistory = { data: [{ time: 123456, price: 50000 }] };
      const req = createMockRequest({ symbol: "BTC", days: "7" });
      const res = createMockResponse();
      (validateAndParseDays as jest.Mock).mockReturnValue(7);
      (getCryptoMarketChart as jest.Mock).mockResolvedValue(mockHistory);

      await getHistoryHandler(req as Request, res as Response);

      expect(validateAndParseDays).toHaveBeenCalledWith("7", "days");
      expect(getCryptoMarketChart).toHaveBeenCalledWith("btc", 7);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockHistory);
    });

    it("should return 400 when symbol is missing", async () => {
      const req = createMockRequest({ days: "7" });
      const res = createMockResponse();
      (validateAndParseDays as jest.Mock).mockReturnValue(7);

      await getHistoryHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.VALIDATION.SYMBOL_REQUIRED,
        details: { field: "symbol" }
      });
      expect(getCryptoMarketChart).not.toHaveBeenCalled();
    });


    it("should return 404 when history not found", async () => {
      const req = createMockRequest({ symbol: "BTC", days: "7" });
      const res = createMockResponse();
      (validateAndParseDays as jest.Mock).mockReturnValue(7);
      (getCryptoMarketChart as jest.Mock).mockResolvedValue(null);

      await getHistoryHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.NOT_FOUND.HISTORY
      });
    });

    it("should handle service errors", async () => {
      const req = createMockRequest({ symbol: "BTC" });
      const res = createMockResponse();
      const error = new Error("Service error");
      (validateAndParseDays as jest.Mock).mockReturnValue(7);
      (getCryptoMarketChart as jest.Mock).mockRejectedValue(error);

      await getHistoryHandler(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.SERVER.INTERNAL
      });
    });
  });
});