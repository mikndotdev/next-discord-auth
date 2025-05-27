import type { NextRequest, NextResponse } from "next/server";
import type { Session } from "./index";

export declare function getSession(req: NextRequest): Promise<Session | null>;

export declare function signIn(req: NextRequest): Promise<NextResponse>;

export declare function signOut(req: NextRequest): Promise<NextResponse>;
