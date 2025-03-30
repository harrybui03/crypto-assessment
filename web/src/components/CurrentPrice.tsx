import {usePriceStore} from "../store/usePriceStore.ts";
import useCurrentPrice from "../hooks/useCurrentPrice.ts";
import {Box, Typography} from "@mui/material";
import Loading from "./Loading.tsx";

const CurrentPrice = () => {
    const { coin } = usePriceStore();
    const { data, loading } = useCurrentPrice(coin);

    if (loading) {
        return <Loading/>;
    }

    if (!data) return <div>No price data available</div>;
    const { price = 0 } = data;

    return (
        <Box sx={{ width: '100%', display: 'flex' ,justifyContent:'center' }}>
            <Typography variant="h3" gutterBottom>
                Current Price: ${price}
            </Typography>
        </Box>
    );
};

export default CurrentPrice;