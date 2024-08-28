
import connectToDatabase from "@/lib/db"; // Have to have this import so that we can connect database
import { JSONObject } from "@/lib/definations";
import Notification from "@/lib/schemas/NotificationSchema";
import User from '@/lib/schemas/User.schema';
import * as Utils from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
	await connectToDatabase(); // Ensure DB connection

	const { searchParams } = new URL(request.url);
	
	const userId = searchParams.get("userId");
	const notification = await Notification.find({ userId });

	return NextResponse.json(notification, { status: 200 });
}

// Update "Notifications" list
export async function POST(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection

		const {userId, notifications} = await request.json();
		const notificationResponse = await Notification.findOneAndUpdate(
			{ 
				_id: userId
			},
			{
                $set: {
                    'notifications': notifications
                },
            },
            { new: true }
		);
		return NextResponse.json(notificationResponse, { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection

		const notification = await request.json();
		const notificationResponse = await Notification.findOneAndUpdate(
			{ 
				_id: notification._id
			},
			{
                $set: {
                    'notifications.$': {
                        ...notification,
                        newMessage : false
                    },
                },
            },
            { new: true }
		);
		return NextResponse.json(notificationResponse, { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}


export async function DELETE(request: NextRequest) {
	try {
		await connectToDatabase(); // Ensure DB connection
		
		const { searchParams } = new URL(request.url);
		const _id = searchParams.get("_id");

		const updatednotification  = await Notification.findOneAndDelete( { _id} );
		
        if (!updatednotification) {
            throw new Error(`The notification '${_id}' is not found`);
        }

		return NextResponse.json(updatednotification , { status: 200 }); // Return the updated user document
		
	} catch (error) {
		return NextResponse.json({ msg: Utils.getErrMessage(error) }, { status: 404 });
	}
}
