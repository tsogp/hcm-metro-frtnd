"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Step1Values,
  Step2Values,
  Step3Values,
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/schema";
import { Step1 } from "./RegisterStep1";
import { Step2 } from "./RegisterStep2";
import { Step3 } from "./RegisterStep3";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { RegisterFormData } from "@/types";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    studentId: "",
    disabilityStatus: "no",
    revolutionaryContribution: "no",
  });

  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    },
  });

  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
    },
  });

  const step3Form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      nationalId: formData.nationalId,
      studentId: formData.studentId,
      disabilityStatus: formData.disabilityStatus as "yes" | "no",
      revolutionaryContribution: formData.revolutionaryContribution as
        | "yes"
        | "no",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = (data: Step1Values) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Values) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3Values) => {
    const finalData = { ...formData, ...data };
    console.log(finalData);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {currentStep === 1 && "Enter your email and create a password"}
          {currentStep === 2 && "Tell us about yourself"}
          {currentStep === 3 && "Just a few more details"}
        </p>
      </div>

      <div className="grid gap-5">
        {currentStep === 1 && (
          <Form {...step1Form}>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)}>
              <Step1
                formData={formData}
                handleInputChange={handleInputChange}
                step1Form={step1Form}
              />
              <Button type="submit" className="mt-6 w-full">
                Next
              </Button>
            </form>
          </Form>
        )}

        {currentStep === 2 && (
          <Form {...step2Form}>
            <form onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
              <Step2
                formData={formData}
                handleInputChange={handleInputChange}
                step2Form={step2Form}
              />
              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Next
                </Button>
              </div>
            </form>
          </Form>
        )}

        {currentStep === 3 && (
          <Form {...step3Form}>
            <form onSubmit={step3Form.handleSubmit(handleStep3Submit)}>
              <Step3
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                step3Form={step3Form}
              />
              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Register
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-10 rounded-full ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline underline-offset-4">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
