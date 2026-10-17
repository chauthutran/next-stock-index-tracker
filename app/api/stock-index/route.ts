import { getStockQuotes } from "@/services/stockDataService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const symbols = new URL(request.url).searchParams.get("symbols");
	if (!symbols?.trim()) {
		return NextResponse.json(
			{ error: "At least one stock symbol is required." },
			{ status: 400 },
		);
	}

	try {
		const quotes = await getStockQuotes(symbols.split(","));
		return NextResponse.json(quotes, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json(
			{ error: `Failed to read stock quotes: ${message}` },
			{ status: 500 },
		);
	}
}
