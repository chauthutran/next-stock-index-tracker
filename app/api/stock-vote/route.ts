
import connectToDatabase from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import StockVote from "@/lib/schemas/StockVote.schema";
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
	await connectToDatabase();

	const { searchParams } = new URL(request.url);
	const userId = searchParams.get("userId");
	
	let stockVotes;
	 // Find stocks where the userId is present in either upvotes or downvotes
	 if( userId !== null ) {
		stockVotes = await StockVote.find({
			$or: [
			  { 'votes.upvotes.userIds': userId },
			  { 'votes.downvotes.userIds': userId }
			]
		  });
	 }
	 else {
		stockVotes = await StockVote.find();
	 }

	return NextResponse.json(stockVotes, { status: 200 });
}

export async function POST(request: NextRequest) {
	try {
		const {userId, symbol, voteType} = await request.json();

		if (!userId || !symbol || !voteType) {
			return NextResponse.json({ error: "Missing required fields. Please check if 'userId', 'symbol', 'voteType' exist"}, { status: 200 });
		}

		await connectToDatabase();

console.log("============ stockVote POST");
		
console.log(userId);
		const updateField = voteType === 'upvote' ? 'upvotes' : 'downvotes';
		const oppositeField = voteType === 'upvote' ? 'downvotes' : 'upvotes';

		// Find the stock vote document
		const stockVote = await StockVote.findOne({ symbol });

console.log("============ stockVote");
console.log(stockVote);
		if (!stockVote) { // Add new
		   // Find the document and update it or insert if it does not exist
		   const addedVote = await StockVote.findOneAndUpdate(
			{ symbol }, // Filter by symbol
			{
				$addToSet: { [`votes.${updateField}.userIds`]: userId },
				$inc: { [`votes.${updateField}.count`]: 1 }
			},
			{ new: true, upsert: true } // Create the document if it does not exist
		  );

		  return NextResponse.json(addedVote, { status: 200 }); 
		}
		else {
				
			const hasVotedInOppositeField = stockVote.votes[oppositeField].userIds.includes(userId);
		
	console.log("-------------------- hasVotedInOppositeField");
	console.log(hasVotedInOppositeField);
			// Remove the user from the opposite field if they voted there
			if (hasVotedInOppositeField) {
			await StockVote.updateOne(
				{ symbol },
				{
				$pull: { [`votes.${oppositeField}.userIds`]: userId },
				$inc: { [`votes.${oppositeField}.count`]: -1 }
				}
			);
			}
		
			// Add the user to the selected vote field
			const updateResult = await StockVote.updateOne(
			{ symbol },
			{
				$addToSet: { [`votes.${updateField}.userIds`]: userId },
				$inc: { [`votes.${updateField}.count`]: 1 }
			}
			);
		
			// if (updateResult.matchedCount === 0) {
			//   throw new Error('Failed to update the vote');
			// }
	console.log("-------------------- updateResult");
	console.log(updateResult);
		return NextResponse.json(updateResult, { status: 200 }); // Return the updated user document
		}
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}


export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const _id = searchParams.get("_id");

		const updatednotification  = await StockVote.findOneAndDelete( { _id} );
		
        if (!updatednotification) {
            throw new Error(`The notification '${_id}' is not found`);
        }

		return NextResponse.json(updatednotification , { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}
