import { TUser, TWatchlistStock } from "../../types/models";
import { updateDataList } from "./fileService";

const userFileName = "users.json";

type WatchlistAction = "add" | "remove";

export class WatchlistServiceError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404,
  ) {
    super(message);
    this.name = "WatchlistServiceError";
  }
}

export const updateWatchlist = async ({
  action,
  userId,
  groupName,
  stock,
}: {
  action: WatchlistAction;
  userId: string;
  groupName: string;
  stock: TWatchlistStock;
}) =>
  updateDataList<TUser, Omit<TUser, "password"> | null>(
    userFileName,
    (users) => {
      const user = users.find((item) => item._id === userId);
      if (!user) {
        throw new WatchlistServiceError("User not found.", 404);
      }

      const watchlist = user.watchlist ?? [];
      let group = watchlist.find((item) => item.groupName === groupName);

      if (action === "add") {
        if (!group) {
          group = { groupName, stocks: [] };
          watchlist.push(group);
        }
        group.stocks.push(stock);
      } else {
        if (group) {
          const remainingStocks = group.stocks.filter(
            (item) => item.symbol !== stock.symbol,
          );
          if (remainingStocks.length !== group.stocks.length) {
            group.stocks = remainingStocks;
            user.updatedAt = new Date().toISOString();
          }
        }
      }

      user.watchlist = watchlist;
      if (action === "add") {
        user.updatedAt = new Date().toISOString();
      }

      const { password: _password, ...publicUser } = user;
      return publicUser;
    },
  );
