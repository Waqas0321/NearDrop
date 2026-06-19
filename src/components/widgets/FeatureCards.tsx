import { Zap, Lock, MonitorSmartphone } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Zap,
    title: "Zero Latency",
    description:
      "Direct peer-to-peer connection for blazing fast transfers.",
  },
  {
    icon: Lock,
    title: "Encrypted",
    description:
      "End-to-end encryption ensures only intended recipients see your data.",
  },
  {
    icon: MonitorSmartphone,
    title: "Cross-Platform",
    description:
      "Works between Web, iOS, Android and Windows seamlessly.",
  },
];

export function FeatureCards() {
  return (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
      {features.map(({ icon: Icon, title, description }) => (
        <Card key={title} padding="md" variant="muted" className="shadow-none">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
            <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <h3 className="mb-2 text-base font-bold text-foreground">{title}</h3>
          <p className="text-sm leading-5 text-muted">{description}</p>
        </Card>
      ))}
    </div>
  );
}
