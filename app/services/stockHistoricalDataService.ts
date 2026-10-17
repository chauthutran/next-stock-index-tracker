import {
  getStockChartData,
  StockNotFoundError,
} from "./stockChartService";

export { StockNotFoundError };

export const getStockHistoricalData = async (
  symbol: string,
  startDate: string,
  endDate: string,
) => {
  const { meta, quotes } = await getStockChartData(symbol, startDate, endDate);

  return {
    meta,
    timestamp: quotes.map((quote) => Date.parse(quote.date) / 1000),
    indicators: {
      quote: [
        {
          open: quotes.map((quote) => quote.open),
          high: quotes.map((quote) => quote.high),
          low: quotes.map((quote) => quote.low),
          close: quotes.map((quote) => quote.close),
          volume: quotes.map((quote) => quote.volume),
        },
      ],
      adjclose: [
        {
          adjclose: quotes.map((quote) => quote.adjclose),
        },
      ],
    },
  };
};
