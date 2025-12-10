import { headers } from "next/headers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type Session, getGlobalConfig } from "./index";
import { RefreshAccessToken } from "./lib/oauth";
import jwt from "jsonwebtoken";

export const getSession = async (): Promise<Session | null> => {
	const config = getGlobalConfig();
	const cookieStore = await cookies();
	const token = cookieStore.get("AUTH_SESSION")?.value;
	if (!token) return null;

	try {
		const session = jwt.verify(token, config.jwtSecret) as Session;
		if (session.expires) {
			const expiresAt = new Date(session.expires);
			if (expiresAt < new Date()) {
				cookieStore.delete("AUTH_SESSION");
				return null;
			} else {
				const timeUntilExpiration = expiresAt.getTime() - Date.now();
				if (timeUntilExpiration < 5 * 60 * 1000) { // less than 5 minutes
					const refreshedSession = await RefreshAccessToken(config, session.refreshToken || "");
					if (refreshedSession) {
						session.accessToken = refreshedSession.accessToken;
						session.refreshToken = refreshedSession.refreshToken;
						session.expires = new Date(Date.now() + refreshedSession.expiresIn * 1000).toISOString();
						const newToken = jwt.sign(session, config.jwtSecret);
						cookieStore.set("AUTH_SESSION", newToken, { sameSite: "lax", httpOnly: true, secure: true });
					}
				}
				return session;
			}
		}
		return null;
	} catch (error) {
		console.error("Invalid token:", error);
		return null;
	}
};

export const signIn = async (redirectTo?: string): Promise<Response> => {
	const config = getGlobalConfig();
	const session = await getSession();
	const cookieStore = await cookies();
	const headersList = await headers();
	const redirectUri = redirectTo ?? headersList.get("Referer") ?? "/";
	await cookieStore.set("REDIRECT_AFTER", redirectUri, { sameSite: "lax", httpOnly: true, secure: true });
	if (session) {
		return Response.json({ message: "Already signed in" }, { status: 200 });
	}
	const signInURL = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=${config.scopes.join(" ")}`;
	return redirect(signInURL);
};

export const signOut = async (): Promise<Response> => {
	const cookieStore = await cookies();
	const token = cookieStore.get("AUTH_SESSION")?.value;
	if (!token) {
		return Response.json({ message: "Not signed in" }, { status: 401 });
	}

	cookieStore.delete("AUTH_SESSION");

	return Response.json({ message: "Signed out successfully" }, { status: 200 });
};