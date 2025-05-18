import { z } from "zod";

export const step1Schema = z
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
      .min(8, "Password must be at least 8 characters")
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
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const baseStep2Schema = {
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "Max 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Max 50 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^0\d{9}$/, "Phone number must start with 0 and be 10 digits"),
  address: z
    .string()
    .min(1, "Address is required")
    .regex(
      /^[\p{L}0-9\s,./-]+$/u,
      "Address contains invalid characters; only letters, numbers, spaces, commas (,), dots (.), slashes (/) and dashes (-) are allowed"
    ),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
};

export const step2Schema = z.object({
  ...baseStep2Schema,
  middleName: z
    .string()
    .min(1, "Middle name is required")
    .max(50, "Max 50 characters"),
});

export const googleStep2Schema = z.object({
  ...baseStep2Schema,
  middleName: z.string().max(50, "Max 50 characters").optional(),
});

export const step3Schema = z.object({
  nationalId: z
    .string()
    .min(1, "National ID is required")
    .regex(/\d{12}$/, "National ID must be 12 digits"),
  studentId: z
    .string()
    .max(15, "Student ID must be at most 15 characters")
    .regex(
      /^[a-zA-Z0-9]*$/,
      "Student ID must contain only alphanumeric characters"
    )
    .optional(),
  disabilityStatus: z.enum(["yes", "no"]),
  revolutionaryContribution: z.enum(["yes", "no"]),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values =
  | z.infer<typeof step2Schema>
  | z.infer<typeof googleStep2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
