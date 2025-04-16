"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordVisibilityProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordVisibility = React.forwardRef<
  HTMLInputElement,
  PasswordVisibilityProps
>(({ className, ...props }, ref) => {
  const [isView, setIsView] = useState(false);

  const toggleButton = () => {
    setIsView(!isView);
  };

  return (
    <div className="relative w-full">
      <Input
        type={isView ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
        ref={ref}
      />

      <button
        className="absolute right-0 inset-y-0 px-2"
        type="button"
        onClick={() => toggleButton()}
      >
        {isView ? (
          <EyeOffIcon className="h-5 w-5" />
        ) : (
          <EyeIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
});

PasswordVisibility.displayName = "PasswordInput";

export { PasswordVisibility };
