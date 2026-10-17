import { searchStocks } from "@/services/stockSearchService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const query = new URL(request.url).searchParams.get("symbol")?.trim();
	if (!query) {
		return NextResponse.json(
			{ error: "A stock search query is required." },
			{ status: 400 },
		);
	}

	try {
		return NextResponse.json(await searchStocks(query), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json(
			{ error: `Stock search failed: ${message}` },
			{ status: 500 },
		);
	}
}
