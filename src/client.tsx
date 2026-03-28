"use client";

import { type ClientSession } from "./index";
import { getSession } from "./server-actions";
import { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";

interface UserInfoContextType {
	session: ClientSession | null;
	isLoading: boolean;
	isError: boolean;
	mutate: () => void;
}

const UserInfoContext = createContext<UserInfoContextType | undefined>(
	undefined,
);

const fetcher = async (url: string): Promise<ClientSession | null> => {
	const res = await fetch(url);
	const data = (await res.json()) as { error?: string } | ClientSession;

	if ("error" in data && data.error) {
		return null;
	}

	return data as ClientSession;
};

export function UserInfoProvider({
	children,
	path,
}: {
	children: ReactNode;
	path: string;
}) {
	const { data, error, isLoading, mutate } = useSWR<ClientSession | null>(
		path,
		fetcher,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		},
	);

	return (
		<UserInfoContext.Provider
			value={{
				session: data ?? null,
				isLoading,
				isError: !!error,
				mutate,
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
}

export function useUserInfo() {
	const context = useContext(UserInfoContext);

	if (context === undefined) {
		throw new Error("useUserInfo must be used within a UserInfoProvider");
	}

	return context;
}

export const createSessionProviderRoute = () => {
	return async (_request: Request) => {
		const session = await getSession();

		if (!session) {
			return Response.json({ error: "Not logged in" }, { status: 401 });
		} else {
			const { accessToken, refreshToken, ...clientSession } = session;
			return Response.json(clientSession);
		}
	};
};
