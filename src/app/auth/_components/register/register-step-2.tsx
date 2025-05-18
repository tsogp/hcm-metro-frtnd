"use client";

import { Input } from "@/components/ui/input";
import { RegisterData } from "@/types/register";
import { Step2Values } from "@/schemas/register";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { DatePicker } from "@/components/input-picker/date-picker-input";
import { format, getYear } from "date-fns";

interface Step2Props {
  formData: RegisterData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step2Form: UseFormReturn<Step2Values>;
  isFromGoogle: boolean;
}

export function Step2({
  formData,
  handleInputChange,
  step2Form,
  isFromGoogle,
}: Step2Props) {
  return (
    <div className="grid gap-5">
      <FormField
        control={step2Form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your first name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step2Form.control}
        name="middleName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle Name {isFromGoogle && "(Optional)"}</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                value={formData.middleName}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your middle name"
              />
            </FormControl>
            {isFromGoogle && (
              <FormDescription className="text-xs">
                Middle name not required with Google sign-up
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step2Form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your last name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step2Form.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your phone number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step2Form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Residence Address</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                value={formData.address}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your address"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={step2Form.control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <DatePicker
                date={
                  field.value && !isNaN(Date.parse(field.value))
                    ? new Date(field.value)
                    : undefined
                }
                setDate={(date) => {
                  const isoDate = format(date, "yyyy-MM-dd");
                  field.onChange(isoDate);
                  handleInputChange({
                    target: {
                      name: "dateOfBirth",
                      value: isoDate,
                    },
                  } as React.ChangeEvent<HTMLInputElement>);
                }}
                endYear={getYear(new Date())}
                dateRestriction="future"
                error={!!step2Form.formState.errors.dateOfBirth}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
