import { readJsonFile } from "./fileService";

export type StockHistoryEntry = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjustedClose?: number;
  volume: number;
};

export type StockRecord = {
  symbol: string;
  shortName: string;
  longName: string;
  quoteType: string;
  currency: string;
  exchange: string;
  exchangeTimezoneShortName: string;
  regularMarketPrice: number;
  regularMarketTime: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  marketCap: number;
  dividendYield: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  dataSource: string;
  history: StockHistoryEntry[];
};

type StockDataFile = {
  stocks: StockRecord[];
};

const stockSymbolAliases: Record<string, string> = {
  GOOG: "GOOGL",
};

const toStockQuote = (stock: StockRecord) => ({
  symbol: stock.symbol,
  shortName: stock.shortName,
  longName: stock.longName,
  quoteType: stock.quoteType,
  currency: stock.currency,
  exchange: stock.exchange,
  exchangeTimezoneShortName: stock.exchangeTimezoneShortName,
  regularMarketPrice: stock.regularMarketPrice,
  regularMarketChange: stock.regularMarketChange,
  regularMarketChangePercent: stock.regularMarketChangePercent,
  regularMarketPreviousClose: stock.regularMarketPreviousClose,
  regularMarketOpen: stock.regularMarketOpen,
  regularMarketDayHigh: stock.regularMarketDayHigh,
  regularMarketDayLow: stock.regularMarketDayLow,
  regularMarketVolume: stock.regularMarketVolume,
  marketCap: stock.marketCap,
  dividendYield: stock.dividendYield,
  fiftyTwoWeekLow: stock.fiftyTwoWeekLow,
  fiftyTwoWeekHigh: stock.fiftyTwoWeekHigh,
  dataSource: stock.dataSource,
  typeDisp: stock.quoteType,
  fullExchangeName: stock.exchange,
  exchangeTimezoneName: stock.exchangeTimezoneShortName,
  regularMarketDayRange: `${stock.regularMarketDayLow} - ${stock.regularMarketDayHigh}`,
  fiftyTwoWeekRange: `${stock.fiftyTwoWeekLow} - ${stock.fiftyTwoWeekHigh}`,
  regularMarketTime: new Date(stock.regularMarketTime),
});

export const getStockRecords = async (): Promise<StockRecord[]> => {
  const stockData = await readJsonFile<StockDataFile>("stock-data.json");
  if (!stockData || !Array.isArray(stockData.stocks)) {
    throw new Error("Stock data file has an invalid format.");
  }

  return stockData.stocks;
};

export const getStockQuotes = async (symbols: string[]) => {
  if (symbols.length === 0 || symbols.some((symbol) => !symbol.trim())) {
    throw new Error("At least one non-empty stock symbol is required.");
  }

  const stocks = await getStockRecords();
  const stocksBySymbol = new Map(
    stocks.map((stock) => [stock.symbol.toUpperCase(), stock]),
  );

  return symbols.flatMap((symbol) => {
    const requestedSymbol = symbol.trim().toUpperCase();
    const lookupSymbol = stockSymbolAliases[requestedSymbol] ?? requestedSymbol;
    const stock = stocksBySymbol.get(lookupSymbol);
    if (!stock) return [];

    return [{ ...toStockQuote(stock), symbol: requestedSymbol }];
  });
};

export const getTrendingStocks = async () => {
  const stocks = await getStockRecords();

  return stocks
    .slice()
    .sort(
      (left, right) =>
        Math.abs(right.regularMarketChangePercent) -
        Math.abs(left.regularMarketChangePercent),
    )
    .map(toStockQuote);
};
