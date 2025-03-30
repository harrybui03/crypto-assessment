import { TextField } from "@mui/material";
import { usePriceStore } from "../store/usePriceStore";
import {useState , KeyboardEvent } from "react";

const SearchBar = () => {
  const { coin, setCoin } = usePriceStore();
  const [inputValue, setInputValue] = useState(coin);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setCoin(inputValue);
    }
  };

  return (
    <TextField
      label="Search coin"
      variant="outlined"
      fullWidth
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={handleKeyDown}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;
