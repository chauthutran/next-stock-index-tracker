import { getStockRecords } from "./stockDataService";

export class StockNotFoundError extends Error {
  constructor(symbol: string) {
    super(`No stock data found for symbol "${symbol}".`);
    this.name = "StockNotFoundError";
  }
}

export const getStockChartData = async (
  symbol: string,
  startDate: string,
  endDate: string,
) => {
  const startTime = Date.parse(startDate);
  const endTime = Date.parse(endDate);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || startTime > endTime) {
    throw new Error("A valid start date before or equal to the end date is required.");
  }

  const stocks = await getStockRecords();
  const stock = stocks.find(
    (item) => item.symbol.toUpperCase() === symbol.toUpperCase(),
  );
  if (!stock) {
    throw new StockNotFoundError(symbol);
  }

  const quotes = stock.history
    .filter((item) => {
      const dateTime = Date.parse(item.date);
      return dateTime >= startTime && dateTime <= endTime;
    })
    .map((item) => ({
      date: new Date(item.date).toISOString(),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      adjclose: item.adjustedClose ?? item.close,
      volume: item.volume,
    }));

  return {
    meta: {
      symbol: stock.symbol,
      shortName: stock.shortName,
      longName: stock.longName,
      currency: stock.currency,
      exchangeName: stock.exchange,
      exchangeTimezoneShortName: stock.exchangeTimezoneShortName,
      dataGranularity: "1d",
    },
    quotes,
  };
};
