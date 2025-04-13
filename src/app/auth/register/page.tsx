"use client";

import { TrainFront } from "lucide-react";
import Image from "next/image";
import { RegisterForm } from "../_components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.5fr_1fr]">
      <div className="relative hidden bg-muted lg:block">
        <Image
          sizes="(min-width: 1024px) 66vw, 0vw"
          fill
          src="/images/login-hero.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <TrainFront className="size-4" />
            </div>
            HCMC Metro Line - PAWA
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
