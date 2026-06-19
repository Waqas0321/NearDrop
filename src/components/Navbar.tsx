"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  isLoggedIn?: boolean;
  userInitial?: string;
  profileImage?: string | null;
  onProfileClick?: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
];

export function Navbar({
  isLoggedIn = false,
  userInitial = "S",
  profileImage = null,
  onProfileClick,
}: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border-light bg-background/95 font-sans backdrop-blur-sm">
        <div className="grid h-14 grid-cols-[1fr_auto] items-center gap-3 px-4 sm:h-16 sm:grid-cols-[1fr_auto_1fr] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 justify-self-start">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Logo size="md" />
          </div>

          <nav className="hidden items-center justify-center gap-8 md:flex">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary underline decoration-primary decoration-2 underline-offset-8"
                      : "text-foreground hover:text-primary",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2 justify-self-end sm:gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <button
                type="button"
                onClick={onProfileClick}
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-white transition-opacity hover:opacity-90"
                aria-label="Open profile settings"
              >
                {profileImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  userInitial
                )}
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link href="/register">
                  <Button className="rounded-full px-4 py-2 text-xs font-semibold sm:px-6 sm:py-2.5 sm:text-sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-border-light px-4 py-3 md:hidden">
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(href);

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={closeMenu}
                      className={[
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-light text-primary"
                          : "text-foreground hover:bg-surface-muted",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
      <div className="h-14 shrink-0 sm:h-16" aria-hidden="true" />
    </>
  );
}
