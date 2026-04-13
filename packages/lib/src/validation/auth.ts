import { z } from "zod";

export const emailAuthSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.")
});

export type EmailAuthInput = z.input<typeof emailAuthSchema>;
