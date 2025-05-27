import { NextRequest, NextResponse } from "next/server";
import { type Session, getGlobalConfig } from "./index";
import jwt from "jsonwebtoken";

export const getSession = async (req: NextRequest): Promise<Session | null> => {
	const config = getGlobalConfig();
	const token = req.cookies.get("AUTH_SESSION")?.value;
	if (!token) {
		return null;
	}

	try {
		return jwt.verify(token, config.jwtSecret) as Session;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

export const signIn = async (req: NextRequest): Promise<NextResponse> => {
	const config = getGlobalConfig();
	const session = await getSession(req);
	if (session) {
		return NextResponse.json(
			{ message: "Already signed in" },
			{ status: 200 },
		);
	}

	const signInURL = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=${config.scopes.join(" ")}`;
	return NextResponse.redirect(signInURL, 302);
};

export const signOut = async (req: NextRequest): Promise<NextResponse> => {
	const config = getGlobalConfig();
	const session = await getSession(req);
	if (!session) {
		return NextResponse.json({ message: "Not signed in" }, { status: 401 });
	}

	const response = NextResponse.json(
		{ message: "Signed out successfully" },
		{ status: 200 },
	);
	response.cookies.delete("AUTH_SESSION");
	return response;
};
