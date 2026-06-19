import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "save"
  | "ghost"
  | "danger"
  | "dark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover shadow-sm",
  secondary:
    "bg-primary-light text-primary hover:bg-primary-muted",
  save:
    "bg-surface-muted text-foreground hover:bg-border-light font-medium",
  ghost:
    "bg-transparent text-muted hover:text-foreground hover:bg-surface-muted",
  danger:
    "bg-danger-bg text-danger hover:bg-danger-bg-hover",
  dark:
    "bg-dark text-white hover:opacity-90 shadow-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", fullWidth, className = "", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50",
          variants[variant],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
