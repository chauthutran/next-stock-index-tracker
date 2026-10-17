import {
	addNotificationSetting,
	getNotificationSettings,
	removeNotificationSetting,
	saveNotificationSettings,
} from "@/services/notificationSettingsService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const userId = new URL(request.url).searchParams.get("userId");
	try {
		return NextResponse.json(await getNotificationSettings(userId), {
			status: 200,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { userId, notifications } = await request.json();
		if (typeof userId !== "string" || !Array.isArray(notifications)) {
			return NextResponse.json(
				{ error: "A user ID and notification list are required." },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			await saveNotificationSettings(userId, notifications),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { userId, notification } = await request.json();
		if (
			typeof userId !== "string" ||
			typeof notification?.symbol !== "string"
		) {
			return NextResponse.json(
				{ error: "A user ID and notification are required." },
				{ status: 400 },
			);
		}
		return NextResponse.json(
			await addNotificationSetting(userId, notification),
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	try {
		return NextResponse.json(
			await removeNotificationSetting(
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
