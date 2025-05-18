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
  googleStep2Schema,
} from "@/schemas/register";
import { Step1 } from "./register-step-1";
import { Step2 } from "./register-step-2";
import { Step3 } from "./register-step-3";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { RegisterData } from "@/types/register";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { googleRegister, register, validateRegister } from "@/action/register";
import { format } from "date-fns";
import { useUserStore } from "@/store/user-store";
import { ROUTES } from "@/config/routes";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { login, fetchUserProfile } = useUserStore();
  const router = useRouter();

  const searchParams = useSearchParams();

  const givenName = searchParams.get("givenName") || "";
  const familyName = searchParams.get("familyName") || "";

  const isFromGoogle =
    searchParams.get("givenName") || searchParams.get("familyName")
      ? true
      : false;
  const [currentStep, setCurrentStep] = useState(isFromGoogle ? 2 : 1);

  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: isFromGoogle ? givenName : "",
    middleName: "",
    lastName: isFromGoogle ? familyName : "",
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
    resolver: zodResolver(isFromGoogle ? googleStep2Schema : step2Schema),
    defaultValues: {
      firstName: formData.firstName,
      middleName: formData.middleName || "",
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
    const onValidateAction = validateRegister(data.email);

    toast.promise(onValidateAction, {
      loading: "Validating your email...",

      success: () => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep(2);
        return "Valid email address";
      },
      error: (e) => {
        if (e?.response?.status) {
          switch (e.response.status) {
            case 400:
              return e.response.data?.message || "Invalid request";
            case 409:
              return e.response.data?.message || "Conflict occurred";
            case 500:
              return e.response.data?.message || "Internal Server Error";
            default:
              return e.response.data?.message || "Internal Server Error";
          }
        }
        return "Internal Server Error";
      },
    });
  };

  const handleStep2Submit = (data: Step2Values) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: Step3Values) => {
    setFormData((prev) => ({ ...prev, ...data }));

    const passengerData = {
      passengerFirstName: formData.firstName,
      passengerMiddleName: formData.middleName,
      passengerLastName: formData.lastName,
      passengerPhone: formData.phoneNumber,
      passengerAddress: formData.address,
      passengerDateOfBirth: format(formData.dateOfBirth, "dd/MM/yyyy"),
      nationalID: data.nationalId,
      studentID: formData.studentId || null,
      hasDisability: data.disabilityStatus === "yes",
      isRevolutionary: data.revolutionaryContribution === "yes",
    };

    const userData = {
      email: formData.email,
      password: formData.password,
      role: "PASSENGER" as const,
      passengerData,
    };

    const onRegisterAction = isFromGoogle
      ? googleRegister(passengerData)
      : register(userData);
    toast.promise(onRegisterAction, {
      loading: "We're getting things ready for you...",

      success: async (res) => {
        if (isFromGoogle) {
          await fetchUserProfile();
        } else {
          await login(userData.email, userData.password);
        }
        router.push(ROUTES.DASHBOARD);
        return "Registration successful! Signing you in...";
      },
      error: (e) => {
        if (e?.response?.status) {
          switch (e.response.status) {
            case 400:
              return e.response.data?.message || "Invalid request";
            case 404:
              return e.response.data?.message || "Resource not found";
            case 409:
              return e.response.data?.message || "Conflict occurred";
            default:
              return e.response.data?.message || "Internal Server Error";
          }
        }
        return "Internal Server Error";
      },
    });
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
                isFromGoogle={isFromGoogle}
              />
              <div className="flex gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                  disabled={isFromGoogle}
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
          <Link
            href="/auth/login"
            className="text-primary underline underline-offset-4 font-bold"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
