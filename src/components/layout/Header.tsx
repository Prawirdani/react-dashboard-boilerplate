import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { LogOut, Menu, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { titleCase } from "@/lib/strings";
import { useAuth } from "@/context/hooks";
import { Button } from "@/components/ui/button";
import ModeToggle from "../theme-toggler";

interface HeaderProps {
	sidebarOpen: boolean;
	setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<header className="border-b shadow-sm sticky top-0 bg-card z-40 p-2 lg:p-4 flex justify-between lg:justify-end items-center">
			<Button
				id="sidebar-toggle"
				aria-controls="sidebar"
				aria-expanded={sidebarOpen}
				onClick={toggleSidebar}
				variant="ghost"
				className="lg:hidden p-2 h-auto w-auto rounded-md"
			>
				<Menu />
			</Button>
			<Dropdown />
		</header>
	);
}

function Dropdown() {
	const navigate = useNavigate();
	const { user, logout } = useAuth();

	const handleLogout = async () => {
		await logout().finally(() => {
			navigate("/auth/login", { replace: true });
		});
	};
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex items-center gap-3 p-4">
					<div className="[&>p]:text-sm font-medium">
						<p className="tracking-wide">{user.fullname}</p>
						<p className="text-end text-sm text-muted-foreground">
							{titleCase(user.role)}
						</p>
					</div>
					<div className="rounded-full h-9 w-9 border">
						<img
							src={user.picture}
							alt="profile"
							className="rounded-full h-full w-full object-cover box-border"
						/>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="mt-3 w-52">
				<ModeToggle />
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="space-x-2 text-sm p-3"
					onClick={() => navigate("/account")}
				>
					<UserRound size={18} />
					<span>Akun</span>
				</DropdownMenuItem>
				<Dialog>
					<DialogTrigger className="w-full">
						<DropdownMenuItem
							className="space-x-2 text-sm p-3"
							onSelect={(e) => e.preventDefault()}
						>
							<LogOut size={18} />
							<span>Logout</span>
						</DropdownMenuItem>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Konfirmasi Logout</DialogTitle>
							<DialogDescription>
								Apakah anda yakin ingin keluar dari aplikasi?
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								type="button"
								variant="default"
								onClick={handleLogout}
								className="w-20"
							>
								Ya
							</Button>
							<DialogClose asChild>
								<Button type="button" variant="outline" className="w-20">
									Batal
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
