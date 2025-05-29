import { type NextRequest, NextResponse } from "next/server";
import { type Session, getGlobalConfig } from "./index";
import { cookies } from "next/headers";
import { ExchangeCodeForTokens } from "./lib/oauth";
import jwt from "jsonwebtoken";

export const handleRedirect = async (req: NextRequest) => {
	const config = getGlobalConfig();
	const cookieStore = await cookies();
	const params = new URL(req.url).searchParams;
	const code = params.get("code");

	if (!code) {
		return NextResponse.json(
			{ error: "Authorization code not found" },
			{ status: 400 },
		);
	}

	const response = await ExchangeCodeForTokens(config, code);

	const sessionData = await fetch("https://discord.com/api/users/@me", {
		headers: {
			Authorization: `Bearer ${response.accessToken}`,
		},
	});

	if (!sessionData.ok) {
		const error = (await sessionData.json()) as {
			error?: string;
			message?: string;
		};
		return NextResponse.json(
			{ error: error.message || "Failed to fetch user data" },
			{ status: 500 },
		);
	}

	const userData = (await sessionData.json()) as {
		id: string;
		username: string;
		discriminator: string;
		avatar: string | null;
		email?: string;
	};

	const session: Session = {
		user: {
			id: userData.id,
			name: `${userData.username}`,
			email: userData.email,
			avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
		},
		expires: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
	};

	const token = jwt.sign(session, config.jwtSecret, {
		expiresIn: response.expiresIn,
	});

	cookieStore.set("AUTH_SESSION", token, { sameSite: "lax", httpOnly: true, secure: true });
};
