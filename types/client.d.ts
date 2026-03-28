import type { ClientSession } from "./index";
import type { ReactNode } from "react";
import type { NextRequest } from "next/server";

interface UserInfoContextType {
	session: ClientSession | null;
	isLoading: boolean;
	isError: boolean;
	mutate: () => void;
}

export declare function UserInfoProvider(props: {
	children: ReactNode;
	path: string;
}): JSX.Element;

export declare function useUserInfo(): UserInfoContextType;

export declare function createSessionProviderRoute(
	request: NextRequest,
): Promise<Response>;
