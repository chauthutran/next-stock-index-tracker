
import connectToDatabase from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Portfolio from "@/lib/schemas/PortfolioSchema";
import User from '@/lib/schemas/User.schema';
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
	await connectToDatabase(); // Ensure DB connection

	const { searchParams } = new URL(request.url);
	
	const userId = searchParams.get("userId");
	const portfolio = await Portfolio.findOne({ userId });

	return NextResponse.json(portfolio, { status: 200 });
}

export async function POST(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection
	
		const { userId, investment } = await request.json();
		// userId = new mongoose.Types.ObjectId(userId as string);

		const addInvestment  = await Portfolio.findOneAndUpdate(
			{ userId },
			{
                $push: { investments: investment },
            },
            { new: true, upsert: true } // Create a new portfolio if not found
		);

		if (!addInvestment ) {
            throw new Error('Portfolio not found');
        }

		return NextResponse.json(addInvestment, { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}


export async function PUT(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection
		
		const { userId, investment } = await request.json();

		const symbol = investment.symbol;
		const portfolio = await Portfolio.findOneAndUpdate(
			{ userId, 'investments.symbol': symbol },
			{
                $set: {
                    'investments.$': {
                        ...investment,
                        symbol,
                    },
                },
            },
            { new: true }
		);
		return NextResponse.json(portfolio, { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}


export async function DELETE(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection
		
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId");
		const symbol = searchParams.get("symbol");

		const updatedPortfolio  = await Portfolio.findOneAndUpdate(
			{ userId, 'investments.symbol': symbol },
			{
                $pull: { investments: { symbol } },
            },
            { new: true }
		);
		
        if (!updatedPortfolio) {
            throw new Error('Investment not found');
        }

		return NextResponse.json(updatedPortfolio , { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}
