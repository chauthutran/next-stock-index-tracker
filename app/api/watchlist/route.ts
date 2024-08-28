
import connectToDatabase from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import User from '@/lib/schemas/User.schema';
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
	await connectToDatabase(); // Ensure DB connection
	
	// payload : {action: "add/remove", userId: "xxx", groupName: "", stock: stockData}
	const payload: JSONObject = await request.json();
	const { action, userId, groupName, stock } = payload;

	try {
		// Check if the user exists
		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found.');
		}

		// Check if the group already exists in the watchlist
		const groupExists = user.watchlist.some((group: any) => group.groupName === groupName);

		let updatedUser;
		if (groupExists) {
			// If the group exists, update the stocks array
			if( action === "add" ) {
				updatedUser = await User.findOneAndUpdate(
					{ _id: userId, "watchlist.groupName": groupName },
					{ $push: { "watchlist.$.stocks": stock } },
					{ new: true, useFindAndModify: false }
				).exec();
			}
			else if( action === "remove" ) {
				updatedUser = await User.findOneAndUpdate(
					{ _id: userId, "watchlist.groupName": groupName },
					{ $pull: { "watchlist.$.stocks": { symbol: stock.symbol } } },
					{ new: true, useFindAndModify: false }
				).exec();
			}

			if (!updatedUser) {
				throw new Error('Failed to add watchlist.');
			}

			console.log('Watchlist updated successfully.');
			return NextResponse.json(updatedUser, { status: 200 });

		} else { // Ass new
			// If the group does not exist, create a new group and add the stock
			updatedUser = await User.findOneAndUpdate(
				{ _id: userId },
				{ $addToSet: { watchlist: { groupName: groupName, stocks: [stock] } } },
				{ new: true, useFindAndModify: false }
			).exec();

			if (!updatedUser) {
				throw new Error('Failed to update watchlist.');
			}
		}

		console.log('Watchlist updated successfully.');
		return NextResponse.json(updatedUser, { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}

}

