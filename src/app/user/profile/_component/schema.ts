import { z } from "zod";

export const profileFormSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
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
      })
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 8,
        "Password must be at least 8 characters"
      )
      .refine(
        (val) => !val || /[A-Z]/.test(val),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (val) => !val || /[a-z]/.test(val),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (val) => !val || /\d/.test(val),
        "Password must contain at least one digit"
      )
      .refine(
        (val) => !val || /[@#$%]/.test(val),
        "Password must contain at least one special character (@, #, $, %)"
      ),
    confirmPassword: z.string().optional(),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^0\d{9}$/, "Phone number must start with 0 and be 10 digits"),
    address: z.string().min(1, "Address is required"),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
