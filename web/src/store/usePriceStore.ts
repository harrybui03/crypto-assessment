import { create } from "zustand";

interface CryptoState {
  coin: string;
  range: string;
  setCoin: (coin: string) => void;
  setRange: (range: string) => void;
}

export const usePriceStore = create<CryptoState>((set) => ({
  coin: "bitcoin",
  range: "1",
  setCoin: (coin) => set({ coin }),
  setRange: (range) => set({ range }),
}));
