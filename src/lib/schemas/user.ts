import { z } from "zod";

const message = "Mohon isi kolom diatas";
export const userUpdateSchema = z.object({
	fullname: z.string().min(1, { message }),
	username: z.string().min(1, { message }),
	email: z.string().email({ message: "Format email tidak valid" }),
	phone: z.string().min(1, { message }),
});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
