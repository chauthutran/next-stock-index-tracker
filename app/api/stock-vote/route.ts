import {
	castStockVote,
	deleteStockVote,
	getStockVotes,
	StockVoteNotFoundError,
} from "@/services/stockVoteService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const userId = new URL(request.url).searchParams.get("userId");
		return NextResponse.json(await getStockVotes(userId), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, symbol, voteType } = await request.json();
		if (
			typeof userId !== "string" ||
			typeof symbol !== "string" ||
			(voteType !== "upvote" && voteType !== "downvote")
		) {
			return NextResponse.json(
				{ error: "Valid userId, symbol, and voteType are required." },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			await castStockVote(userId, symbol, voteType),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const id = new URL(request.url).searchParams.get("_id");
	try {
		return NextResponse.json(await deleteStockVote(id), { status: 200 });
	} catch (error) {
		if (error instanceof StockVoteNotFoundError) {
			return NextResponse.json({ error: error.message }, { status: 404 });
		}
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
