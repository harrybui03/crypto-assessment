import { Button, ButtonGroup } from "@mui/material";
import { usePriceStore } from "../store/usePriceStore";

const RANGES = [
  { label: "1 Day", value: "1" },
  { label: "7 Days", value: "7" },
  { label: "1 Month", value: "30" },
  { label: "3 Months", value: "90" },
  { label: "1 Year", value: "365" },
];

const DateRangeButton = () => {
  const { range, setRange } = usePriceStore();
  return (
    <ButtonGroup sx={{ mb: 2 }}>
      {RANGES.map((r) => (
        <Button
          key={r.value}
          variant={range === r.value ? "contained" : "outlined"}
          onClick={() => setRange(r.value)}
        >
          {r.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default DateRangeButton;
