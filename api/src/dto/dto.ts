export interface Price {
    price: number;
    symbol: string;
}

export interface HistoryChart {
    data: HistoryChartElement[];
}

export interface HistoryChartElement {
    price: number;
    time: number;
}

export type PriceResponse = Record<string, {
        usd?: number;
    }>;