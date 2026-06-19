import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-12">
        <article className={`${CLIPBOARD_WIDTH}`}>
          <header className="mb-8 border-b border-border-light pb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-muted">Last updated: {lastUpdated}</p>
          </header>

          <div className="legal-content space-y-8 text-sm leading-7 text-muted sm:text-base">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
