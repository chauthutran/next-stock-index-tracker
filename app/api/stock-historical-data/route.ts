import {
	getStockHistoricalData,
	StockNotFoundError,
} from "@/services/stockHistoricalDataService";
import { NextRequest, NextResponse } from "next/server";

const validIntervals = [
	"1m", "2m", "5m", "15m", "30m", "60m", "90m",
	"1h", "1d", "5d", "1wk", "1mo", "3mo",
];

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const symbol = searchParams.get("symbol")?.trim();
	const startDate = searchParams.get("startDate");
	const endDate = searchParams.get("endDate");
	const interval = searchParams.get("interval");

	if (
		!symbol || !startDate || !endDate ||
		!interval || !validIntervals.includes(interval)
	) {
		return NextResponse.json(
			{ error: "A symbol, start date, end date, and valid interval are required." },
			{ status: 400 },
		);
	}

	try {
		return NextResponse.json(
			await getStockHistoricalData(symbol, startDate, endDate),
			{ status: 200 },
		);
	} catch (error) {
		if (error instanceof StockNotFoundError) {
			return NextResponse.json({ error: error.message }, { status: 404 });
		}
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json(
			{ error: `Failed to read stock historical data: ${message}` },
			{ status: 500 },
		);
	}
}
