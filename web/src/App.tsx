import "./App.css";
import { Container, CssBaseline, Typography } from "@mui/material";
import SearchBar from "./components/SearchBar";
import DateRangeButton from "./components/DateRangeButton";
import CryptoChart from "./components/CrytoChart";
import CurrentPrice from "./components/CurrentPrice.tsx";
import CryptoDataWrapper from "./components/CryptoDataWrapper.tsx";

function App() {
  return (
    <Container maxWidth="md">
      <CssBaseline />
      <Typography variant="h4" align="center" gutterBottom>
        Crypto Price Tracker
      </Typography>
      <SearchBar />
        <CryptoDataWrapper>
            <CurrentPrice/>
            <DateRangeButton />
            <CryptoChart />
        </CryptoDataWrapper>

    </Container>
  );
}

export default App;
