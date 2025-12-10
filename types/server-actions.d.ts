import type { Session } from "./index";

export declare function getSession(): Promise<Session | null>;

export declare function signIn(): Promise<Response>;

export declare function signOut(): Promise<Response>;