"use client";

import { Input } from "@/components/ui/input";
import { RegisterFormData } from "./type";
import { Step2Values } from "./schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface Step2Props {
  formData: RegisterFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step2Form: UseFormReturn<Step2Values>;
}

export function Step2({ formData, handleInputChange, step2Form }: Step2Props) {
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
            <FormLabel>Middle Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="text"
                value={formData.middleName}
                onChange={(e) => {
                  field.onChange(e);
                  handleInputChange(e);
                }}
                placeholder="Enter your middle name (optional)"
              />
            </FormControl>
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
              <Input
                {...field}
                type="date"
                value={formData.dateOfBirth}
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
    </div>
  );
}
