import type { NextRequest, NextResponse } from "next/server";
import type { Session, Config } from "./index";
import jwt from "jsonwebtoken";

export const getSession = async (config: Config, req: NextRequest): Promise<Session | null> => {
    const token = req.cookies.get("AUTH_SESSION")?.value;
    if (!token) {
        return null;
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as Session;
        return decoded;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}