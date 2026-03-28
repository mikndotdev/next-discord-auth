import type { ClientSession } from "./index";
import type { ReactNode } from "react";

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
