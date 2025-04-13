"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormData } from "./types";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Step2Values } from "./schema";

interface Step2Props {
  formData: RegisterFormData;
  errors: FieldErrors<Step2Values>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<Step2Values>;
}

export function Step2({
  formData,
  errors,
  handleInputChange,
  register
}: Step2Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          {...register("firstName")}
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
          placeholder="Enter your first name"
          className={errors.firstName ? "border-red-500" : ""}
        />
        {errors.firstName && (
          <p className="text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="middleName">Middle Name</Label>
        <Input
          id="middleName"
          {...register("middleName")}
          type="text"
          value={formData.middleName}
          onChange={handleInputChange}
          placeholder="Enter your middle name (optional)"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          {...register("lastName")}
          type="text"
          value={formData.lastName}
          onChange={handleInputChange}
          placeholder="Enter your last name"
          className={errors.lastName ? "border-red-500" : ""}
        />
        {errors.lastName && (
          <p className="text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          {...register("phoneNumber")}
          type="tel"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Residence Address</Label>
        <Input
          id="address"
          {...register("address")}
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Enter your address"
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && (
          <p className="text-xs text-red-500">{errors.address.message}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          {...register("dateOfBirth")}
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className={errors.dateOfBirth ? "border-red-500" : ""}
        />
        {errors.dateOfBirth && (
          <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
        )}
      </div>
    </div>
  );
}
