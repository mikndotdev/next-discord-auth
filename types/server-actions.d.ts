import type { NextResponse } from "next/server";
import type { Session } from "./index";

export declare function getSession(): Promise<Session | null>;

export declare function signIn(): Promise<NextResponse>;

export declare function signOut(): Promise<NextResponse>;