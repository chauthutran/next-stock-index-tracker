import {
	updateWatchlist,
	WatchlistServiceError,
} from "@/services/watchlistService";
import { TWatchlistStock } from "../../../types/models";
import { NextRequest, NextResponse } from "next/server";

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null;

export async function POST(request: NextRequest) {
	try {
		const payload: unknown = await request.json();
		if (!isRecord(payload) || !isRecord(payload.stock)) {
			return NextResponse.json(
				{ error: "A valid watchlist request is required." },
				{ status: 400 },
			);
		}

		const { action, userId, groupName } = payload;
		const stockData = payload.stock;
		if (
			(action !== "add" && action !== "remove") ||
			typeof userId !== "string" ||
			!userId.trim() ||
			typeof groupName !== "string" ||
			!groupName.trim() ||
			typeof stockData.symbol !== "string" ||
			!stockData.symbol.trim()
		) {
			return NextResponse.json(
				{ error: "Action, userId, groupName, and stock symbol are required." },
				{ status: 400 },
			);
		}

		const stock: TWatchlistStock = {
			symbol: stockData.symbol.trim(),
			name: typeof stockData.name === "string" ? stockData.name : "",
			addedAt:
				typeof stockData.addedAt === "string"
					? stockData.addedAt
					: new Date().toISOString(),
		};
		const updatedUser = await updateWatchlist({
			action,
			userId,
			groupName: groupName.trim(),
			stock,
		});

		return NextResponse.json(updatedUser, { status: 200 });
	} catch (error) {
		if (error instanceof WatchlistServiceError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}

		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json(
			{ error: `Failed to update watchlist: ${message}` },
			{ status: 500 },
		);
	}
}
