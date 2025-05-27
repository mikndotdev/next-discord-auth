import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type Session, getGlobalConfig } from "./index";
import jwt from "jsonwebtoken";

export const getSession = async (): Promise<Session | null> => {
	const config = getGlobalConfig();
	const cookieStore = await cookies();
	const token = cookieStore.get("AUTH_SESSION")?.value;
	if (!token) return null;

	try {
		return jwt.verify(token, config.jwtSecret) as Session;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

export const signIn = async (): Promise<NextResponse> => {
	const config = getGlobalConfig();
	const session = await getSession();
	if (session) {
		return NextResponse.json({ message: "Already signed in" }, { status: 200 });
	}
	const signInURL = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=${config.scopes.join(" ")}`;
	return redirect(signInURL);
};

export const signOut = async (): Promise<NextResponse> => {
	const config = getGlobalConfig();
	const cookieStore = await cookies();
	const token = cookieStore.get("AUTH_SESSION")?.value;
	if (!token) {
		return NextResponse.json({ message: "Not signed in" }, { status: 401 });
	}

	try {
		jwt.verify(token, config.jwtSecret);
	} catch {
		return NextResponse.json({ message: "Invalid session" }, { status: 401 });
	}

	cookieStore.delete("AUTH_SESSION");
};