import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiRequest } from '../../src/utils/app';
import { ERROR_CODES, ERROR_MESSAGES } from '../../src/constant/error';

interface MockUser {
  id: number;
  name: string;
}

describe('apiRequest', () => {
  let mockAxios: MockAdapter;
  const mockUser: MockUser = { id: 1, name: 'Test User' };

  beforeEach(() => {
    mockAxios = new MockAdapter(axios, { onNoMatch: 'throwException' });
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('successful responses', () => {
    it('handles GET requests with typed response', async () => {
      mockAxios.onGet('/users/1').reply(200, mockUser);

      const result = await apiRequest<MockUser>({
        url: '/users/1',
      });

      expect(result).toEqual({
        success: true,
        data: mockUser
      });
    });

    it('uses GET as default method', async () => {
      mockAxios.onGet('/default-method').reply(200, mockUser);

      const result = await apiRequest<MockUser>({
        url: '/default-method'
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });
  });

  describe('error responses', () => {
    it('handles 400 Bad Request', async () => {
      mockAxios.onGet('/bad-request').reply(400);

      const result = await apiRequest({
        url: '/bad-request'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.BAD_REQUEST,
          code: ERROR_CODES.BAD_REQUEST
        }
      });
    });

    it('handles 403 Forbidden (Rate Limited)', async () => {
      mockAxios.onGet('/forbidden').reply(403);

      const result = await apiRequest({
        url: '/forbidden'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.RATE_LIMITED,
          code: ERROR_CODES.FORBIDDEN
        }
      });
    });

    it('handles 404 Not Found', async () => {
      mockAxios.onGet('/not-found').reply(404);

      const result = await apiRequest({
        url: '/not-found'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.NOT_FOUND,
          code: ERROR_CODES.NOT_FOUND
        }
      });
    });

    it('handles 429 Too Many Requests', async () => {
      mockAxios.onGet('/too-many-requests').reply(429);

      const result = await apiRequest({
        url: '/too-many-requests'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.RATE_LIMITED,
          code: ERROR_CODES.TOO_MANY_REQUESTS
        }
      });
    });

    it('handles 500 Server Error', async () => {
      mockAxios.onGet('/server-error').reply(500);

      const result = await apiRequest({
        url: '/server-error'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.SERVER_ERROR,
          code: ERROR_CODES.INTERNAL_SERVER_ERROR
        }
      });
    });

    it('handles network errors', async () => {
      mockAxios.onGet('/network-failure').networkError();

      const result = await apiRequest({
        url: '/network-failure'
      });

      expect(result).toEqual({
        success: false,
        error: {
          message: ERROR_MESSAGES.API.NETWORK_ERROR,
          code: ERROR_CODES.SERVICE_UNAVAILABLE
        }
      });
    });
  });
});