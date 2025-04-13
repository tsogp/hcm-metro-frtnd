"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormData } from "./types";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Step1Values } from "./schema";

interface Step1Props {
  formData: RegisterFormData;
  errors: FieldErrors<Step1Values>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<Step1Values>;
}

export function Step1({
  formData,
  errors,
  handleInputChange,
  register,
}: Step1Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          {...register("email")}
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          {...register("password")}
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a password"
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          {...register("confirmPassword")}
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
    </div>
  );
}
