"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelAction?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelAction, type = "text", className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {(label || labelAction) && (
          <div className="mb-2 flex items-center justify-between">
            {label && (
              <label className="text-sm font-medium text-foreground">
                {label}
              </label>
            )}
            {labelAction}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={[
              "w-full rounded-lg bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-light outline-none transition-shadow focus:ring-2 focus:ring-primary/20",
              isPassword ? "pr-11" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
