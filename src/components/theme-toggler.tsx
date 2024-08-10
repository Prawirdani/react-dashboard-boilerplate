import { useTheme } from "@/components/theme-provider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function ModeToggle() {
	const { setTheme, theme } = useTheme();

	function toggleTheme(on: boolean) {
		setTheme(on ? "dark" : "light");
	}

	return (
		<div className="flex items-center justify-between p-3">
			<Label htmlFor="theme-mode">Mode Gelap</Label>
			<Switch
				id="theme-mode"
				checked={theme === "dark"}
				onCheckedChange={toggleTheme}
			/>
		</div>
	);
}
