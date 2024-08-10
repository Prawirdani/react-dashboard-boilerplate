import TitleSetter from "@/components/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { H2 } from "@/components/typography";
import { isErrorResponse } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormSchema, loginFormSchema } from "@/lib/schemas/auth";
import { useAuth } from "@/context/hooks";

export default function LoginPage() {
	const navigate = useNavigate();
	const [apiError, setApiError] = useState<string | null>(null);

	const form = useForm<LoginFormSchema>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			usernameOrEmail: "",
			password: "",
		},
	});

	const { login } = useAuth();

	const onSubmit = async (values: LoginFormSchema) => {
		const res = await login(values.usernameOrEmail, values.password);
		if (!res.ok) {
			const resBody = await res.json();
			setApiError(
				isErrorResponse(resBody) ? resBody.error.message : "Terjadi kesalahan",
			);
			return;
		}
		navigate("/", { replace: true });
	};
	return (
		<>
			<TitleSetter title="Login" />
			<div className="h-screen flex place-items-center bg-accent overflow-hidden">
				<Card className="mx-auto w-[calc(100%-10%)] sm:w-[450px] shadow-lg">
					<Form {...form}>
						<form
							autoComplete="on"
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4 p-8"
						>
							<H2 className="text-center mb-8">Login</H2>
							<div className="space-y-2">
								<FormField
									control={form.control}
									name="usernameOrEmail"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="usernameOrEmail">
												Username atau Email
											</FormLabel>
											<FormControl>
												<Input
													autoComplete="on"
													id="usernameOrEmail"
													placeholder="Masukkan username atau email anda"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel htmlFor="password">Password</FormLabel>
											<FormControl>
												<Input
													autoComplete="on"
													id="password"
													type="password"
													placeholder="Masukkan password anda"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							{apiError && (
								<p className="text-destructive font-medium text-sm">
									{apiError}
								</p>
							)}
							<div className="flex flex-col items-end gap-y-3">
								<Link to="/" className="text-sm text-blue-500 font-semibold">
									Lupa password?
								</Link>
								<Button
									type="submit"
									className="w-full"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? (
										<>
											<Loader2 className="animate-spin mr-2" />
											<span>Mohon tunggu</span>
										</>
									) : (
										<span>Login</span>
									)}
								</Button>
							</div>
						</form>
					</Form>
				</Card>
			</div>
		</>
	);
}
