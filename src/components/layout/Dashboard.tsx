import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/hooks";

interface DashboardProps {
	SidebarItems: SidebarItem[];
}

export default function Dashboard({ SidebarItems }: DashboardProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { isAuthenticated } = useAuth();

	return isAuthenticated ? (
		<div className="flex min-h-screen overflow-hidden">
			{/* Sidebar component */}
			<Sidebar
				items={SidebarItems}
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>
			{/* Sidebar component */}

			<div className="flex-1 flex flex-col relative overflow-x-hidden pl-0 lg:pl-72">
				{/* Header component */}
				<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				{/* Header component */}
				{/* Main content */}
				<main className="bg-accent dark:bg-slate-900 flex-1 p-4 sm:p-8 overflow-y-auto">
					<Outlet />
				</main>
				{/* Main content */}
			</div>
		</div>
	) : (
		<Navigate to="/auth/login" replace />
	);
}
