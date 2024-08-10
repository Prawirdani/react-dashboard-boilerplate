import TitleSetter from "@/components/title";
import { Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/hooks";
import { Fetch, isErrorResponse } from "@/lib/fetcher";
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
import { userUpdateSchema, type UserUpdateSchema } from "@/lib/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function UserAccountPage() {
	const [edit, setEdit] = useState(false);
	const [open, setOpen] = useState(false);
	const { user } = useAuth();

	return (
		<section className="h-full xl:w-3/5 xl:mx-auto">
			<TitleSetter title="Dashboard" />
			<Card className="p-6 sm:p-10">
				<div className="mb-6 sm:mb-12 flex justify-between h-10">
					<div>
						<Title className="leading-3">Informasi Akun</Title>
						<span className="hidden sm:block text-muted-foreground text-xs sm:text-sm leading-3">
							ID: {user.id}
						</span>
					</div>

					{!edit && (
						<Button variant="ghost" onClick={() => setEdit(true)}>
							<Pencil size={18} />
						</Button>
					)}
				</div>
				<div className="flex flex-col sm:flex-row justify-start mb-4 sm:gap-8">
					<div className="flex flex-col items-center mb-6 sm:w-[35%]">
						<SetProfileDialog open={open} setOpen={setOpen} />
						<div
							className="rounded-full z-10 w-28 h-28 md:w-44 md:h-44 border border-accent-foreground mb-4 overflow-hidden cursor-pointer"
							onClick={() => setOpen(true)}
						>
							<img
								className="rounded-full object-cover w-full h-full transition-all duration-300 hover:filter hover:brightness-75 hover:contrast-125"
								src={user.picture}
							/>
						</div>
						<small>Ketuk gambar untuk mengganti</small>

						{!user.picture.includes("default.jpg") && <ResetProfileDialog />}
					</div>
					<div className="space-y-4 flex flex-col flex-1">
						{edit ? (
							<UpdateProfileForm setEdit={setEdit} />
						) : (
							<>
								<div>
									<p className="font-semibold text-sm">Nama Lengkap</p>
									<p className="text-muted-foreground">{user.fullname}</p>
								</div>
								<div>
									<p className="font-semibold text-sm">Email</p>
									<p className="text-muted-foreground">{user.email}</p>
								</div>
								<div>
									<p className="font-semibold text-sm">Username</p>
									<p className="text-muted-foreground">{user.username}</p>
								</div>
								<div>
									<p className="font-semibold text-sm">Nomor Telepon</p>
									<p className="text-muted-foreground">{user.phone ?? "-"}</p>
								</div>
							</>
						)}
					</div>
				</div>
			</Card>
		</section>
	);
}

function ResetProfileDialog() {
	const { identify } = useAuth();

	async function submit() {
		const res = await Fetch("/api/users/me/profile-picture?reset=true", {
			method: "PUT",
			credentials: "include",
		});

		if (!res.ok) {
			toast({
				description: "Gagal menghapus foto profile",
				variant: "destructive",
			});
			return;
		}

		await identify();
		toast({ description: "Berhasil menghapus foto profile" });
	}
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive" size="sm" className="mt-4">
					Hapus Foto
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus foto profile?</DialogTitle>
					<DialogDescription>
						Foto profile akan dihapus dan diganti dengan foto default.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" className="w-20">
							Batal
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="default"
						onClick={submit}
						className="w-20"
					>
						Ya
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface SetProfileDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}
function SetProfileDialog({ open, setOpen }: SetProfileDialogProps) {
	const { identify } = useAuth();

	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	let imageInputRef = useRef<HTMLInputElement>(null);

	const handleImageClick = () => {
		imageInputRef.current?.click();
	};

	const imageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		// form.setValue("image", e.target.files);
		if (files && files[0]) {
			setFile(files[0]);
			const imageUrl = URL.createObjectURL(files[0]);
			setImagePreview(imageUrl);
		}
	};

	useEffect(() => {
		if (!open) {
			setImagePreview(null);
		}
	}, [open]);

	async function onSubmit() {
		try {
			if (!file) return;

			const formData = new FormData();
			formData.append("image", file);

			const res = await Fetch("/api/users/me/profile-picture", {
				method: "PUT",
				body: formData,
				credentials: "include",
			});

			if (!res.ok) {
				toast({
					description: "Gagal mengubah foto profile",
					variant: "destructive",
				});
				return;
			}

			await identify();
			toast({ description: "Berhasil mengubah foto profile" });
			setOpen(false);
		} catch (error) {
			toast({
				description: "Gagal mengubah foto profile",
				variant: "destructive",
			});
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="flex flex-col gap-6">
				<DialogHeader>
					<DialogTitle>Upload foto profile</DialogTitle>
				</DialogHeader>
				<div
					onClick={() => handleImageClick()}
					className="h-60 rounded-full w-60 border border-accent-foreground self-center hover:cursor-pointer hover:bg-accent flex place-items-center"
				>
					{imagePreview ? (
						<img
							src={imagePreview}
							className="rounded-full object-cover w-full h-full"
						/>
					) : (
						<div className="flex flex-col w-full place-items-center">
							<Image className="mx-auto" size={42} />
							<span>Pilih foto</span>
						</div>
					)}
				</div>

				<input
					accept="image/png, image/jpeg, image/jpg, image/webp"
					id="picture"
					type="file"
					ref={imageInputRef}
					onChange={imageOnChange}
					hidden
				/>

				<DialogDescription>
					Besar maksimum file adalah 3MB. Ekstensi: .jpg .jpeg .png .webp
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button className="w-20" type="button" variant="outline">
							Batal
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="default"
						className="w-20"
						disabled={!imageInputRef.current?.files}
						onClick={onSubmit}
					>
						Simpan
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface UpdateProfileFormProps {
	setEdit: (edit: boolean) => void;
}
function UpdateProfileForm({ setEdit }: UpdateProfileFormProps) {
	const { user, updateProfile, identify } = useAuth();

	const [apiError, setApiError] = useState<string | null>(null);
	const form = useForm<UserUpdateSchema>({
		resolver: zodResolver(userUpdateSchema),
		defaultValues: {
			fullname: user.fullname,
			username: user.username,
			email: user.email,
			phone: user.phone ?? "",
		},
	});

	const onSubmit = async (data: UserUpdateSchema) => {
		const res = await updateProfile(user.id, data);
		if (!res.ok) {
			const resBody = await res.json();
			setApiError(
				isErrorResponse(resBody) ? resBody.error.message : "Terjadi kesalahan",
			);
			return;
		}
		await identify();
		setEdit(false);
		toast({
			description: "Informasi akun berhasil diperbarui",
		});
	};

	return (
		<Form {...form}>
			<form autoComplete="on" onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-2 mb-4">
					{/* Fullname Field */}
					<FormField
						control={form.control}
						name="fullname"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="fullname">Nama Lengkap</FormLabel>
								<FormControl>
									<Input
										autoComplete="on"
										id="fullname"
										placeholder="Masukkan nama lengkap Anda"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* End Of Fullname Field */}

					{/* Email Field */}
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="email">Email</FormLabel>
								<FormControl>
									<Input
										autoComplete="on"
										id="email"
										placeholder="Masukkan email anda"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* End Of Email Field */}

					{/* Username Field */}
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="username">Username</FormLabel>
								<FormControl>
									<Input
										autoComplete="on"
										id="username"
										placeholder="Masukkan username anda"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* End Of Username Field */}

					{/* Phone Field */}
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="phone">Nomor Telepon</FormLabel>
								<FormControl>
									<Input
										autoComplete="on"
										id="phone"
										placeholder="Masukkan nomor telepon anda"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{/* End Of Phone Field */}
				</div>
				{apiError && (
					<p className="text-destructive font-medium text-sm">{apiError}</p>
				)}
				<div className="flex items-end gap-y-3 justify-end gap-x-2">
					<Button
						variant="outline"
						type="button"
						onClick={() => setEdit(false)}
					>
						Batal
					</Button>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting && (
							<Loader2 className="animate-spin mr-2" />
						)}
						<span>Simpan</span>
					</Button>
				</div>
			</form>
		</Form>
	);
}
