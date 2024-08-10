import { z } from "zod";

export const loginFormSchema = z.object({
  usernameOrEmail: z.string().min(1, { message: "Mohon isi kolom diatas" }),
  password: z.string().min(1, { message: "Mohon isi kolom password" }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
