"use client";

import { Input } from "@/components/ui/input";
import { RegisterFormData } from "@/types";
import { Step3Values } from "@/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step3Props {
  formData: RegisterFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  step3Form: UseFormReturn<Step3Values>;
}

export function Step3({
  formData,
  handleInputChange,
  handleSelectChange,
  step3Form,
}: Step3Props) {
  return (
    <div className="grid gap-5">
      <FormField
        control={step3Form.control}
        name="studentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Student ID (Optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={formData.studentId || ""}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step3Form.control}
        name="nationalId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>National ID</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={formData.nationalId || ""}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step3Form.control}
        name="disabilityStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have any disabilities?</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("disabilityStatus", value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step3Form.control}
        name="revolutionaryContribution"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you have any revolutionary contributions?</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                handleSelectChange("revolutionaryContribution", value);
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
