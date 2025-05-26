import type { Config } from "../index";

export const ExchangeCodeForTokens = async (config: Config, code: string) => {
	const response = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: config.clientId,
			client_secret: config.clientSecret,
			grant_type: "authorization_code",
			code: code,
			redirect_uri: config.redirectUri,
			scope: config.scopes.join(" "),
		}),
	});

	if (!response.ok) {
		const error = (await response.json()) as {
			error_description?: string;
			message?: string;
		};
		throw new Error(
			`Failed to exchange code for token: ${error.error_description || error.message}`,
		);
	}

	const data = (await response.json()) as {
		access_token: string;
		refresh_token: string;
		expires_in: number;
	};

	return {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		expiresIn: data.expires_in,
	};
};
