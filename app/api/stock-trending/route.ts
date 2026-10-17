import { getStockTrending } from "@/services/stockTrendingService";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const trendingStocks = await getStockTrending();
		return NextResponse.json(trendingStocks, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json(
			{ error: `Failed to read trending stocks: ${message}` },
			{ status: 500 },
		);
	}
}
