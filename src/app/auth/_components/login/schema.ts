import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email format",
    })
    .refine(
      (email) => {
        const domain = email.split(".").pop()?.toLowerCase();
        return domain === "com" || domain === "vn";
      },
      {
        message: "Email must end with .com or .vn",
      }
    )
    .refine((email) => !/[\s<>()[\]\\,;:{}|^~`]/.test(email), {
      message: "Email cannot contain spaces or special characters",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/\d/, {
      message: "Password must contain at least one digit",
    })
    .regex(/[@#$%]/, {
      message:
        "Password must contain at least one special character (@, #, $, %)",
    }),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
