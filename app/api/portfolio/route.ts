import {
	addInvestment,
	getPortfolio,
	removeInvestment,
	updateInvestment,
} from "@/services/portfolioService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userId = new URL(request.url).searchParams.get("userId");
	try {
		return NextResponse.json(await getPortfolio(userId), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, investment } = await request.json();
		if (typeof userId !== "string" || typeof investment?.symbol !== "string") {
			return NextResponse.json(
				{ error: "A user ID and investment symbol are required." },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			await addInvestment(userId, investment),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { userId, investment } = await request.json();
		if (typeof userId !== "string" || typeof investment?.symbol !== "string") {
			return NextResponse.json(
				{ error: "A user ID and investment symbol are required." },
				{ status: 400 },
			);
		}
		const portfolio = await updateInvestment(userId, investment);
		if (!portfolio) {
			return NextResponse.json(
				{ error: "Investment not found." },
				{ status: 404 },
			);
		}
		return NextResponse.json(portfolio, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}

export async function DELETE(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	try {
		return NextResponse.json(
			await removeInvestment(
				searchParams.get("userId"),
				searchParams.get("symbol"),
			),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 404 });
	}
}
