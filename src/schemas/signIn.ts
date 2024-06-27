import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid Username" }),
  password: z.string().min(8, { message: "Must be 8 character" }),
});
