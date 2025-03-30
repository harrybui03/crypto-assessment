import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { usePriceStore } from "../store/usePriceStore";
import { Box, Typography } from "@mui/material";
import useFetchPrice from "../hooks/useFetchPrice";
import CustomTooltip from "./CustomTooltip/CustomTooltip.tsx";
import Loading from "./Loading.tsx";
import {formatDate} from "../utils/utils.ts";
import ErrorDisplay from "./ErrorDisplay.tsx";

const CryptoChart = () => {
  const { coin, range } = usePriceStore();
  const { data, loading, error } = useFetchPrice(coin, range);

  if (loading) {
    return <Loading/>;
  }

  if (error) return <ErrorDisplay message={error} />;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {coin.toUpperCase()} Price Chart
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(tick) => formatDate(tick)}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dot={false}  dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CryptoChart;
