import LoginPage from "./LoginPage";
import { Outlet, RouteObject } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/hooks";
import Dashboard from "@/components/layout/Dashboard";
import Loader from "@/components/ui/loader";
import { LayoutDashboard } from "lucide-react";
import UserAccountPage from "./dashboard/UserAccount";

function PersistLogin() {
	const [isLoading, setIsLoading] = useState(true);
	const { identify } = useAuth();

	useEffect(() => {
		console.log("Persist Login Executed");
		const identifyUser = async () => {
			await identify().finally(() => setIsLoading(false));
		};

		identifyUser();
	}, []);

	return isLoading ? (
		<div className="h-screen">
			<Loader />
		</div>
	) : (
		<Outlet />
	);
}

const sidebarItems = [
	{
		name: "Dashboard",
		icon: <LayoutDashboard />,
		path: "/",
	},
];

export const Routes: RouteObject[] = [
	{
		path: "/auth/login",
		element: <LoginPage />,
	},
	{
		element: <PersistLogin />,
		children: [
			{
				path: "/",
				element: <Dashboard SidebarItems={sidebarItems} />,
				children: [
					{
						path: "/account",
						element: <UserAccountPage />,
					},
					// {
					//   path: "/admin/users",
					//   element: <UserPage />,
					// },
					// {
					//   path: "/admin/authors",
					//   element: <AuthorPage />,
					// },
				],
			},
		],
	},
];
