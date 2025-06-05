export interface Session {
	user: {
		id: string;
		name: string;
		email?: string;
		avatar: string;
	};
	expires: string;
	accessToken?: string;
	refreshToken?: string;
}

export interface Config {
	clientId: string;
	clientSecret: string;
	scopes: string[];
	redirectUri: string;
	jwtSecret: string;
}

export function setup(config: Config): void;
export function getGlobalConfig(): Config;
