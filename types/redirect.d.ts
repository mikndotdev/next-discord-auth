import type { NextRequest, NextResponse } from "next/server";

export declare function handleRedirect(
	req: NextRequest,
): Promise<NextResponse | void>;
