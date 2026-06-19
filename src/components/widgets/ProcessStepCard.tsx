import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface ProcessStepCardProps {
  step: string;
  title: string;
  description: string;
  icon: ReactNode;
  iconBg?: string;
  className?: string;
  compact?: boolean;
}

export function ProcessStepCard({
  step,
  title,
  description,
  icon,
  iconBg = "bg-primary-light",
  className = "",
  compact = false,
}: ProcessStepCardProps) {
  return (
    <Card
      padding={compact ? "xs" : "md"}
      variant="muted"
      className={`w-full shadow-none ${compact ? "" : "sm:p-6"} ${className}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-full ${iconBg} ${
            compact ? "h-11 w-11" : "h-14 w-14"
          }`}
        >
          {icon}
        </div>
        <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary sm:px-3 sm:py-1 sm:text-[11px]">
          {step}
        </span>
      </div>
      <div className={compact ? "mt-3" : "mt-5"}>
        <h3
          className={`mb-1 font-bold text-foreground ${
            compact ? "text-base" : "mb-2 text-lg"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-muted ${
            compact ? "text-xs leading-5 sm:text-sm" : "text-sm leading-6"
          }`}
        >
          {description}
        </p>
      </div>
    </Card>
  );
}
