import { getStockRecords } from "./stockDataService";

export const searchStocks = async (query: string) => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    throw new Error("A stock search query is required.");
  }

  const stocks = await getStockRecords();
  const quotes = stocks
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(normalizedQuery) ||
        stock.shortName.toLowerCase().includes(normalizedQuery) ||
        stock.longName.toLowerCase().includes(normalizedQuery),
    )
    .slice(0, 10)
    .map((stock) => ({
      symbol: stock.symbol,
      shortname: stock.shortName,
      longname: stock.longName,
      quoteType: stock.quoteType,
      typeDisp: stock.quoteType,
      exchange: stock.exchange,
    }));

  return { quotes };
};
