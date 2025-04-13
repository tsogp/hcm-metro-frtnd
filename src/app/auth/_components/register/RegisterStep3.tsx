"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterFormData } from "./types";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Step3Values } from "./schema";

interface Step3Props {
  formData: RegisterFormData;
  errors: FieldErrors<Step3Values>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  register: UseFormRegister<Step3Values>;
}

export function Step3({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
  register,
}: Step3Props) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="studentId">Student ID (Optional)</Label>
        <Input
          id="studentId"
          {...register("studentId")}
          value={formData.studentId || ""}
          onChange={handleInputChange}
        />
        {errors.studentId && (
          <p className="text-sm text-red-500">{errors.studentId.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="nationalId">National ID</Label>
        <Input
          id="nationalId"
          {...register("nationalId")}
          value={formData.nationalId || ""}
          onChange={handleInputChange}
        />
        {errors.nationalId && (
          <p className="text-sm text-red-500">{errors.nationalId.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="disabilityStatus">Do you have any disabilities?</Label>
        <select
          id="disabilityStatus"
          {...register("disabilityStatus")}
          value={formData.disabilityStatus}
          onChange={(e) =>
            handleSelectChange("disabilityStatus", e.target.value)
          }
          className="w-full p-2 border rounded"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        {errors.disabilityStatus && (
          <p className="text-sm text-red-500">
            {errors.disabilityStatus.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="revolutionaryContribution">
          Do you have any revolutionary contributions?
        </Label>
        <select
          id="revolutionaryContribution"
          {...register("revolutionaryContribution")}
          value={formData.revolutionaryContribution}
          onChange={(e) =>
            handleSelectChange("revolutionaryContribution", e.target.value)
          }
          className="w-full p-2 border rounded"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        {errors.revolutionaryContribution && (
          <p className="text-sm text-red-500">
            {errors.revolutionaryContribution.message}
          </p>
        )}
      </div>
    </div>
  );
}
