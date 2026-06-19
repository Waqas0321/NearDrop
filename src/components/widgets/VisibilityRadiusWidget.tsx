"use client";

import { Radio } from "lucide-react";
import {
  MAX_RADIUS_KM,
  MAX_RADIUS_SLIDER_INDEX,
  METER_ZONE_PERCENT,
  formatVisibilityRadius,
  getRadiusZone,
  radiusKmToSliderIndex,
  sliderIndexToRadiusKm,
} from "@/lib/profile-storage";

interface VisibilityRadiusWidgetProps {
  valueKm: number;
  onChange: (km: number) => void;
}

function parseRadiusDisplay(value: string): { amount: string; unit: string } {
  const [amount, unit] = value.split(" ");
  return { amount, unit };
}

export function VisibilityRadiusWidget({
  valueKm,
  onChange,
}: VisibilityRadiusWidgetProps) {
  const sliderIndex = radiusKmToSliderIndex(valueKm);
  const sliderPercent = (sliderIndex / MAX_RADIUS_SLIDER_INDEX) * 100;
  const zone = getRadiusZone(valueKm);
  const display = parseRadiusDisplay(formatVisibilityRadius(valueKm));

  const activeRadius = 14 + sliderPercent * 1.06;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
              <Radio className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <h3 className="text-sm font-bold text-foreground">Visibility Radius</h3>
          </div>
          <p className="mt-1 pl-8 text-xs leading-4 text-muted">
            Set how far nearby devices can discover you.
          </p>
        </div>

        <div className="flex shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end sm:gap-1">
          <div className="flex items-baseline gap-1 rounded-lg bg-primary-light px-2.5 py-1">
            <span className="text-base font-bold tabular-nums leading-none text-primary">
              {display.amount}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary/70">
              {display.unit}
            </span>
          </div>
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
              zone === "meters"
                ? "bg-teal/10 text-teal"
                : "bg-primary-light text-primary",
            ].join(" ")}
          >
            {zone === "meters" ? "Precise range" : "Wide range"}
          </span>
        </div>
      </div>

      {/* Centered radar preview */}
      <div className="mt-3 flex justify-center">
        <div className="relative aspect-square h-[140px] w-[140px] overflow-hidden rounded-xl border border-border-light bg-background shadow-sm">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="radar-grid"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 16 0 L 0 0 0 16"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="0.75"
                />
              </pattern>
              <radialGradient id="radar-fill" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="var(--primary-light)" stopOpacity="0.55" />
                <stop offset="70%" stopColor="var(--primary-light)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--primary-light)" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="200" height="200" fill="url(#radar-grid)" opacity="0.6" />

            <line
              x1="100"
              y1="8"
              x2="100"
              y2="192"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.5"
            />
            <line
              x1="8"
              y1="100"
              x2="192"
              y2="100"
              stroke="var(--border)"
              strokeWidth="1"
              opacity="0.5"
            />

            {[45, 75, 105].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r}
                fill="none"
                stroke="var(--primary-muted)"
                strokeWidth="1"
                opacity="0.35"
              />
            ))}

            <circle
              cx="100"
              cy="100"
              r={activeRadius}
              fill="url(#radar-fill)"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeOpacity="0.45"
              className="transition-all duration-300 ease-out"
            />

            <circle
              cx="100"
              cy="100"
              r={activeRadius + 4}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeOpacity="0.15"
              className="transition-all duration-300 ease-out"
            />

            <circle cx="100" cy="100" r="5.5" fill="var(--primary)" />
            <circle
              cx="100"
              cy="100"
              r="8"
              fill="none"
              stroke="var(--thumb-ring)"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="100"
              r="11"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeOpacity="0.25"
            />
          </svg>

          <span className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/20" />
          </span>
        </div>
      </div>

      {/* Dual-zone slider */}
      <div className="relative mt-3 h-5">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <div className="flex h-full">
            <div
              className="h-full bg-teal/12"
              style={{ width: `${METER_ZONE_PERCENT}%` }}
            />
            <div className="h-full flex-1 bg-border" />
          </div>
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-teal/40 via-primary/35 to-primary/45 transition-[width] duration-200"
            style={{ width: `${sliderPercent}%` }}
          />
          <div
            className="absolute inset-y-0 w-px bg-primary/30"
            style={{ left: `${METER_ZONE_PERCENT}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={MAX_RADIUS_SLIDER_INDEX}
          step={1}
          value={sliderIndex}
          onChange={(e) =>
            onChange(sliderIndexToRadiusKm(Number(e.target.value)))
          }
          className="visibility-radius-slider absolute inset-x-0 top-0 z-10 h-5 w-full cursor-pointer appearance-none bg-transparent"
          aria-label="Visibility radius"
          aria-valuetext={formatVisibilityRadius(valueKm)}
        />

        <div className="relative mt-2.5 h-3.5 text-[10px] font-medium">
          <span
            className={[
              "absolute left-0 top-0",
              zone === "meters" ? "text-teal" : "text-muted-light",
            ].join(" ")}
          >
            0 M
          </span>
          <span
            className="absolute top-0 -translate-x-1/2 text-muted-light"
            style={{ left: `${METER_ZONE_PERCENT}%` }}
          >
            1 KM
          </span>
          <span className="absolute right-0 top-0 text-muted-light">
            {MAX_RADIUS_KM} KM
          </span>
        </div>
      </div>
    </div>
  );
}
