export interface Session {
    user: {
        id: string;
        name: string;
        email: string | null;
        avatar: string;
    }
    expires: string;
}

export interface Config {
    clientId: string;
    clientSecret: string;
    scopes: string[];
    redirectUri: string;
    jwtSecret: string;
}