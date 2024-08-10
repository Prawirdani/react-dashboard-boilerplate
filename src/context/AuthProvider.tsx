import { Fetch } from "@/lib/fetcher";
import { UserUpdateSchema } from "@/lib/schemas/user";
import { createContext, useState } from "react";

type AuthContextType = {
	user: User;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<Response>;
	identify: () => Promise<void>;
	logout: () => Promise<void>;
	updateProfile: (userID: string, data: UserUpdateSchema) => Promise<Response>;
};

export const AuthCtx = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User>({} as User);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const login = async (email: string, password: string) => {
		const res = await fetch("/api/auth/login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				usernameOrEmail: email,
				password: password,
			}),
		});
		return res;
	};

	const logout = async () => {
		await fetch("/api/auth/logout", {
			method: "DELETE",
			credentials: "include",
		});
		setIsAuthenticated(false);
		setUser({} as User);
	};

	const identify = async () => {
		const res = await Fetch("/api/users/me", {
			method: "GET",
			credentials: "include",
		});
		if (res.ok) {
			const resBody = (await res.json()) as ApiResponse<User>;
			setIsAuthenticated(true);
			setUser(resBody.data);
		}
	};

	const updateProfile = async (userID: string, data: UserUpdateSchema) => {
		const res = await Fetch(`/api/users/${userID}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		return res;
	};
	return (
		<AuthCtx.Provider
			value={{ user, isAuthenticated, login, identify, logout, updateProfile }}
		>
			<>{children}</>
		</AuthCtx.Provider>
	);
}
