import {
	deleteNotification,
	getNotifications,
	markNotificationAsRead,
	saveNotifications,
} from "@/services/notificationsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userId = new URL(request.url).searchParams.get("userId");
	try {
		return NextResponse.json(await getNotifications(userId), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, notifications } = await request.json();
		return NextResponse.json(
			await saveNotifications(userId, notifications),
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
		const notification = await request.json();
		if (typeof notification?._id !== "string") {
			return NextResponse.json(
				{ error: "A notification ID is required." },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			await markNotificationAsRead(notification),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 404 });
	}
}

export async function DELETE(request: NextRequest) {
	const id = new URL(request.url).searchParams.get("_id");
	try {
		return NextResponse.json(await deleteNotification(id), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 404 });
	}
}
