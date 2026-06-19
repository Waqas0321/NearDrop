import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "muted";
}

const paddingMap = {
  xs: "p-3",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  padding = "md",
  variant = "default",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border shadow-sm",
        variant === "muted"
          ? "border-border-light bg-background"
          : "border-border bg-card",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
