import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be atleast 2 character")
  .max(25, "Username max length 25 character");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid Username" }),
  password: z.string().min(8, { message: "Must be 8 character" }),
});
