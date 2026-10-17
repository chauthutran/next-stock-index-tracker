import { randomBytes } from "node:crypto";
import { readFileData, updateDataList } from "./fileService";

const fileName = "stockvotes.json";
type VoteType = "upvote" | "downvote";

type TVoteGroup = {
  count: number | string;
  userIds: string[];
};

type TStockVote = {
  _id: string;
  symbol?: string;
  createdAt: string;
  updatedAt: string;
  votes: {
    upvotes: TVoteGroup;
    downvotes: TVoteGroup;
  };
};

export class StockVoteNotFoundError extends Error {
  constructor(id: string) {
    super(`The stock vote '${id}' was not found.`);
    this.name = "StockVoteNotFoundError";
  }
}

const normalizeVoteGroup = (group: TVoteGroup): TVoteGroup => {
  if (!Array.isArray(group.userIds)) {
    throw new Error("Stock vote user IDs have an invalid format.");
  }

  return { userIds: group.userIds, count: group.userIds.length };
};

const normalizeStockVote = (vote: TStockVote): TStockVote => {
  if (!vote.votes?.upvotes || !vote.votes?.downvotes) {
    throw new Error(`Stock vote '${vote._id}' has an invalid votes structure.`);
  }

  return {
    ...vote,
    votes: {
      upvotes: normalizeVoteGroup(vote.votes.upvotes),
      downvotes: normalizeVoteGroup(vote.votes.downvotes),
    },
  };
};

export const getStockVotes = async (userId: string | null) => {
  const stockVotes = (await readFileData<TStockVote>(fileName)).map(
    normalizeStockVote,
  );

  if (userId === null) return stockVotes;

  return stockVotes.filter(
    (stockVote) =>
      stockVote.votes.upvotes.userIds.includes(userId) ||
      stockVote.votes.downvotes.userIds.includes(userId),
  );
};

export const castStockVote = async (
  userId: string,
  symbol: string,
  voteType: VoteType,
) => {
  if (!userId?.trim() || !symbol?.trim()) {
    throw new Error("A user ID and stock symbol are required.");
  }
  if (voteType !== "upvote" && voteType !== "downvote") {
    throw new Error("Vote type must be 'upvote' or 'downvote'.");
  }

  const normalizedSymbol = symbol.trim().toUpperCase();
  return updateDataList<TStockVote, TStockVote>(fileName, (stockVotes) => {
    let stockVote = stockVotes.find(
      (item) => item.symbol?.toUpperCase() === normalizedSymbol,
    );
    const now = new Date().toISOString();

    if (!stockVote) {
      stockVote = {
        _id: randomBytes(12).toString("hex"),
        symbol: normalizedSymbol,
        createdAt: now,
        updatedAt: now,
        votes: {
          upvotes: { count: 0, userIds: [] },
          downvotes: { count: 0, userIds: [] },
        },
      };
      stockVotes.push(stockVote);
    }

    const target = voteType === "upvote" ? stockVote.votes.upvotes : stockVote.votes.downvotes;
    const opposite =
      voteType === "upvote" ? stockVote.votes.downvotes : stockVote.votes.upvotes;

    opposite.userIds = opposite.userIds.filter((id) => id !== userId);
    if (!target.userIds.includes(userId)) {
      target.userIds.push(userId);
    }

    stockVote.votes.upvotes.count = stockVote.votes.upvotes.userIds.length;
    stockVote.votes.downvotes.count = stockVote.votes.downvotes.userIds.length;
    stockVote.updatedAt = now;

    return normalizeStockVote(stockVote);
  });
};

export const deleteStockVote = async (id: string | null) => {
  if (!id) throw new Error("A stock vote ID is required.");

  return updateDataList<TStockVote, TStockVote>(fileName, (stockVotes) => {
    const index = stockVotes.findIndex((vote) => vote._id === id);
    if (index < 0) {
      throw new StockVoteNotFoundError(id);
    }

    return stockVotes.splice(index, 1)[0];
  });
};
