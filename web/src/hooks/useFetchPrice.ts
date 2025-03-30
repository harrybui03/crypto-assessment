import axios from "axios";
import { useEffect, useState } from "react";
import { validateCoin, validateRange } from "../utils/utils";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface PriceData {
  time: number;
  price: number;
}

interface FetchPriceResult {
  data: PriceData[];
  loading: boolean;
  error: string | null;
}

const useFetchPrice = (coin: string, range: string): FetchPriceResult => {
  const [data, setData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!validateCoin(coin)) {
        setError('Invalid coin symbol');
        return;
      }

      if (!validateRange(range)) {
        setError('Invalid range. Must be 1, 7, 30, or 365 days');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<{ data: PriceData[] }>(
            `${API_URL}/history/${coin}/${range}`
        );

        setData(response.data.data);
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message ?? error.message ?? "An unknown error occurred"
          : "Failed to fetch data";
        setError(errorMessage);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin, range]);

  return { data, loading, error };
};

export default useFetchPrice;