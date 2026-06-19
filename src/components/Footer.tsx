import Link from "next/link";
import { Logo } from "@/components/Logo";

const AUTHOR = {
  name: "Muhammad Waqas Akhtar",
  email: "waqasakhtar548@gmail.com",
  github: "https://github.com/Waqas0321",
  linkedin: "https://www.linkedin.com/in/m-waqas-akhtar-545155276/",
};

const productLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/register", label: "Get Started" },
];

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted transition-all hover:border-primary/40 hover:bg-primary-light hover:text-primary"
    >
      {children}
    </a>
  );
}

interface FooterProps {
  compact?: boolean;
}

export function Footer({ compact = false }: FooterProps) {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="mt-auto shrink-0 border-t border-border-light bg-card">
        <div className="mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-center text-xs text-muted sm:text-left">
              © {year}{" "}
              <span className="font-medium text-foreground">{AUTHOR.name}</span>
            </p>
            <div className="flex items-center gap-2">
              <SocialButton href={`mailto:${AUTHOR.email}`} label="Email support">
                <MailIcon className="h-3.5 w-3.5" />
              </SocialButton>
              <SocialButton href={AUTHOR.github} label="GitHub">
                <GitHubIcon className="h-3.5 w-3.5" />
              </SocialButton>
              <SocialButton href={AUTHOR.linkedin} label="LinkedIn">
                <LinkedInIcon className="h-3.5 w-3.5" />
              </SocialButton>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto shrink-0 border-t border-border-light bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Logo size="md" link={false} />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Instant proximity sharing for files and clipboard. No common network
              needed — just pure, encrypted flow between nearby devices.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <SocialButton
                href={`mailto:${AUTHOR.email}?subject=NearDrop%20Support`}
                label="Email support"
              >
                <MailIcon className="h-4 w-4" />
              </SocialButton>
              <SocialButton href={AUTHOR.github} label="GitHub">
                <GitHubIcon className="h-4 w-4" />
              </SocialButton>
              <SocialButton href={AUTHOR.linkedin} label="LinkedIn">
                <LinkedInIcon className="h-4 w-4" />
              </SocialButton>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-7">
            <h3 className="text-label-caps text-muted-light">Product</h3>
            <ul className="mt-3 space-y-2.5">
              {productLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-label-caps text-muted-light">Legal</h3>
            <ul className="mt-3 space-y-2.5">
              {legalLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${AUTHOR.email}?subject=NearDrop%20Support`}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-label-caps text-muted-light">Contact</h3>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {AUTHOR.name}
              </p>
              <a
                href={`mailto:${AUTHOR.email}`}
                className="block text-sm text-muted transition-colors hover:text-primary"
              >
                {AUTHOR.email}
              </a>
              <p className="text-xs leading-relaxed text-muted-light">
                Flutter Developer · Available for support & collaboration
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border-light pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted sm:text-left">
            © {year}{" "}
            <span className="font-medium text-foreground">{AUTHOR.name}</span>.
            All rights reserved.
          </p>
          <p className="text-center text-xs text-muted-light">
            NearDrop Web Proximity · Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
