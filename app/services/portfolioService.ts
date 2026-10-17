import { randomBytes } from "node:crypto";
import { TInvestment, TPortfolio } from "../../types/models";
import { readFileData, updateDataList } from "./fileService";

const fileName = "portfolios.json";

export const getPortfolio = async (userId: string | null) => {
  if (!userId) return null;

  const portfolios = await readFileData<TPortfolio>(fileName);
  return portfolios.find((portfolio) => portfolio.userId === userId) ?? null;
};

export const addInvestment = async (
  userId: string,
  investment: TInvestment,
) => {
  if (!userId || !investment?.symbol) {
    throw new Error("A user ID and investment symbol are required.");
  }

  return updateDataList<TPortfolio, TPortfolio>(fileName, (portfolios) => {
    let portfolio = portfolios.find((item) => item.userId === userId);

    if (!portfolio) {
      portfolio = {
        _id: randomBytes(12).toString("hex"),
        userId,
        investments: [],
      };
      portfolios.push(portfolio);
    }

    portfolio.investments.push({
      ...investment,
      _id: investment._id ?? randomBytes(12).toString("hex"),
    });

    return portfolio;
  });
};

export const updateInvestment = async (
  userId: string,
  investment: TInvestment,
) => {
  if (!userId || !investment?.symbol) {
    throw new Error("A user ID and investment symbol are required.");
  }

  return updateDataList<TPortfolio, TPortfolio | null>(
    fileName,
    (portfolios) => {
      const portfolio = portfolios.find((item) => item.userId === userId);
      const investmentIndex = portfolio?.investments.findIndex(
        (item) => item.symbol === investment.symbol,
      );

      if (!portfolio || investmentIndex === undefined || investmentIndex < 0) {
        return null;
      }

      portfolio.investments[investmentIndex] = {
        ...portfolio.investments[investmentIndex],
        ...investment,
      };
      return portfolio;
    },
  );
};

export const removeInvestment = async (
  userId: string | null,
  symbol: string | null,
) =>
  updateDataList<TPortfolio, TPortfolio>(fileName, (portfolios) => {
    const portfolio = portfolios.find(
      (item) => item.userId === userId,
    );
    if (!portfolio || !symbol || !portfolio.investments.some(
      (item) => item.symbol === symbol,
    )) {
      throw new Error("Investment not found");
    }

    portfolio.investments = portfolio.investments.filter(
      (item) => item.symbol !== symbol,
    );
    return portfolio;
  });
