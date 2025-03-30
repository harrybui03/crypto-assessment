import { usePriceStore } from "../store/usePriceStore";
import useCurrentPrice from "../hooks/useCurrentPrice";
import Loading from "./Loading";
import ErrorDisplay from "./ErrorDisplay.tsx";

const CryptoDataWrapper = ({ children }: { children: React.ReactNode }) => {
    const { coin } = usePriceStore();
    const { data, loading  , error} = useCurrentPrice(coin);
    if (loading) {
        return <Loading/>;
    }

    if (!coin) return <ErrorDisplay message="Please select a cryptocurrency" />;

    if (error) return <ErrorDisplay message={error} />;

    if (!data) return <ErrorDisplay message={`No data available for ${coin}`} />;

    return <>{children}</>;
};

export default CryptoDataWrapper;