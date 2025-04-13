import { z } from "zod";

export const step1Schema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      // .email("Invalid email format")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      // )
      ,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const step2Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().min(1, "Middle name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export const step3Schema = z.object({
  nationalId: z.string().min(1, "National ID is required"),
  studentId: z.string().optional(),
  disabilityStatus: z.enum(["yes", "no"]),
  revolutionaryContribution: z.enum(["yes", "no"]),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
