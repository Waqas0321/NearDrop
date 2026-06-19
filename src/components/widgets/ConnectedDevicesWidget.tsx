"use client";

import { Laptop, Smartphone, Tablet, Trash2 } from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: "phone" | "tablet" | "laptop";
  lastActive: string;
}

const deviceIcons = {
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
};

const defaultDevices: Device[] = [
  { id: "1", name: "Alex's iPhone", type: "phone", lastActive: "2m ago" },
  { id: "2", name: "Alex's iPad", type: "tablet", lastActive: "15m ago" },
  { id: "3", name: "Alex's Mac", type: "laptop", lastActive: "1h ago" },
];

interface ConnectedDevicesWidgetProps {
  devices?: Device[];
  onRemove?: (id: string) => void;
}

export function ConnectedDevicesWidget({
  devices = defaultDevices,
  onRemove,
}: ConnectedDevicesWidgetProps) {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Connected Devices</h3>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:text-primary-hover"
        >
          CLEAR ALL
        </button>
      </div>

      <div className="space-y-2.5">
        {devices.map((device) => {
          const Icon = deviceIcons[device.type];
          return (
            <div
              key={device.id}
              className="flex items-center gap-3 rounded-xl border border-border-light bg-card p-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                <Icon className="h-5 w-5 text-muted" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {device.name}
                </p>
                <p className="text-xs text-muted-light">
                  Last active: {device.lastActive}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove?.(device.id)}
                className="rounded-lg p-2 text-muted-light transition-colors hover:bg-danger-bg hover:text-danger"
                aria-label={`Remove ${device.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
