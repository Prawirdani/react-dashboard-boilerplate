// app.d.ts
declare global {
	type SidebarItem = {
		name: string;
		icon: React.ReactNode;
		path: string;
	};

	type ApiResponse<T> = {
		data: T;
		message?: string;
	};

	type ErrorResponse = {
		error: {
			status: number;
			message: string;
			details?: Record<string, string>;
		};
	};

	type UserRole = "SuperUser" | "Admin" | "Receptionist";
	type User = {
		id: string;
		fullname: string;
		username: string;
		email: string;
		role: UserRole;
		phone?: string;
		picture: string;
		createdAt: Date;
		updatedAt: Date;
	};
}

export { };
