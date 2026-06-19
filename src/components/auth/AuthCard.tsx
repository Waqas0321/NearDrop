"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AuthCardProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthCard({ children, footer }: AuthCardProps) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-background px-4 py-8 sm:min-h-screen sm:px-4 sm:py-12">
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <Card padding="lg" className="w-full max-w-[448px] p-5 shadow-md sm:p-8">
        {children}
        {footer}
      </Card>
    </div>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted sm:flex-row sm:justify-center">
      <span>{text}</span>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
      >
        {linkText}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
