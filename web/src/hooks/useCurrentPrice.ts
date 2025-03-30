import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Price {
    symbol: string;
    price: number;
}

const useCurrentPrice = (coin: string) => {
    const [data, setData] = useState<Price | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!coin) return;

            setLoading(true);
            try {
                const response = await axios.get<Price>(`${API_URL}/price/${coin}`);
                setData(response.data);
                setError(null)
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.data?.error) {
                    setError(error.response.data.error);
                } else {
                    setError("Failed to fetch price data");
                }
                setData(null);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [coin]);

    return { data, loading , error };
}

export default useCurrentPrice;