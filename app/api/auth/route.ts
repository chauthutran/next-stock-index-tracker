import {
	addNewUser,
	getShareableUsers,
	login,
	setAllowToShare,
} from "@/services/authService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const actionType = new URL(request.url).searchParams.get("actionType");
	if (actionType !== "sharedUsers") {
		return NextResponse.json(
			{ error: "Unsupported authentication action." },
			{ status: 400 },
		);
	}

	try {
		return NextResponse.json(await getShareableUsers(), { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { actionType, payload, email, password, userId, allowToShareSettings } =
			await request.json();

		if (actionType === "login") {
			if (typeof email !== "string" || typeof password !== "string") {
				return NextResponse.json(
					{ error: "Email and password are required." },
					{ status: 400 },
				);
			}
			return NextResponse.json(await login(email, password), { status: 200 });
		}

		if (actionType === "add") {
			return NextResponse.json(await addNewUser(payload), { status: 201 });
		}

		if (actionType === "allowToShare") {
			if (typeof userId !== "string" || typeof allowToShareSettings !== "boolean") {
				return NextResponse.json(
					{ error: "A user ID and sharing preference are required." },
					{ status: 400 },
				);
			}
			const user = await setAllowToShare(userId, allowToShareSettings);
			if (!user) {
				return NextResponse.json({ error: "User not found." }, { status: 404 });
			}
			return NextResponse.json(user, { status: 200 });
		}

		return NextResponse.json(
			{ error: "Unsupported authentication action." },
			{ status: 400 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown error occurred.";
		const status = message === "EMAIL_EXISTS" ? 409 : 500;
		return NextResponse.json({ error: message }, { status });
	}
}
