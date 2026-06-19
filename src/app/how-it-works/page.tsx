import Link from "next/link";
import { Radar, Send } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ProcessStepCard } from "@/components/widgets/ProcessStepCard";
import { AirDropIcon } from "@/components/Logo";
import { CLIPBOARD_WIDTH } from "@/components/widgets/SharedClipboardWidget";

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 pb-12 pt-2 sm:px-6">
          <div
            className={`mb-4 flex shrink-0 ${CLIPBOARD_WIDTH} flex-col items-center text-center lg:mb-5`}
          >
            <h1 className="text-hero text-foreground">
              Simple as <span className="text-primary">Air.</span>
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted sm:text-base">
              A seamless way to share files with anyone in your proximity. No
              accounts, no hassle, just pure flow.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ${CLIPBOARD_WIDTH}`}
          >
            <ProcessStepCard
              compact
              step="STEP 01"
              title="Open NearDrop"
              description="Launch NearDrop on any device. It instantly starts scanning for nearby peers without any setup or pairing required."
              icon={<AirDropIcon size={24} />}
            />
            <ProcessStepCard
              compact
              step="STEP 02"
              title="Select your radius"
              description="Choose who can discover you — just yourself, authorized contacts, or everyone nearby."
              icon={
                <Radar className="h-6 w-6 text-primary" strokeWidth={1.75} />
              }
            />
            <ProcessStepCard
              compact
              step="STEP 03"
              title="Drag and drop to share"
              description="Drop files or paste text into the shared clipboard. Transfers happen instantly over a direct peer-to-peer connection."
              icon={<Send className="h-6 w-6 text-teal" strokeWidth={1.75} />}
              iconBg="bg-teal/10"
              className="sm:col-span-2"
            />
          </div>

          <div
            className={`mt-4 flex shrink-0 flex-col items-center gap-2 lg:mt-5 ${CLIPBOARD_WIDTH}`}
          >
            <Link href="/register" className="w-full">
              <Button
                variant="dark"
                fullWidth
                className="h-11 rounded-full text-sm font-semibold lg:h-12"
              >
                Start Sharing Now
              </Button>
            </Link>
            <p className="text-xs text-muted-light">
              Available on Web, macOS, and Windows
            </p>
          </div>
      </main>

      <Footer />
    </>
  );
}
