const PROFILE_IMAGE_KEY = "neardrop-profile-image";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function getProfileImage(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PROFILE_IMAGE_KEY);
}

export function setProfileImage(dataUrl: string): void {
  localStorage.setItem(PROFILE_IMAGE_KEY, dataUrl);
}

export function removeProfileImage(): void {
  localStorage.removeItem(PROFILE_IMAGE_KEY);
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please select an image file."));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      reject(new Error("Image must be smaller than 5MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read image."));
    reader.readAsDataURL(file);
  });
}

export const DEFAULT_PROFILE_IMAGE =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face";

const RADIUS_KEY = "neardrop-visibility-radius-km";
export const MAX_RADIUS_KM = 500;
export const DEFAULT_RADIUS_KM = 50;
const METER_STEP = 10;
const METER_STEPS = 100; // 0, 10, …, 990 m
const ONE_KM_INDEX = METER_STEPS; // index 100 → 1 km

/** Slider max index: 0–990 m, then 1–500 km */
export const MAX_RADIUS_SLIDER_INDEX = ONE_KM_INDEX + MAX_RADIUS_KM - 1;
export const METER_ZONE_PERCENT = (ONE_KM_INDEX / MAX_RADIUS_SLIDER_INDEX) * 100;

export type RadiusZone = "meters" | "kilometers";

export function getRadiusZone(km: number): RadiusZone {
  return km < 1 ? "meters" : "kilometers";
}

export function formatVisibilityRadius(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} M`;
  }
  return `${Math.round(km)} KM`;
}

export function radiusKmToSliderIndex(km: number): number {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    const stepped = Math.round(meters / METER_STEP) * METER_STEP;
    return Math.min(stepped / METER_STEP, METER_STEPS - 1);
  }
  return Math.min(ONE_KM_INDEX + Math.round(km) - 1, MAX_RADIUS_SLIDER_INDEX);
}

export function sliderIndexToRadiusKm(index: number): number {
  const clamped = Math.min(Math.max(Math.round(index), 0), MAX_RADIUS_SLIDER_INDEX);
  if (clamped < ONE_KM_INDEX) {
    return (clamped * METER_STEP) / 1000;
  }
  return clamped - ONE_KM_INDEX + 1;
}

export function getVisibilityRadiusKm(): number {
  if (typeof window === "undefined") return DEFAULT_RADIUS_KM;
  const stored = localStorage.getItem(RADIUS_KEY);
  if (!stored) return DEFAULT_RADIUS_KM;
  const km = Number(stored);
  if (Number.isNaN(km)) return DEFAULT_RADIUS_KM;
  return Math.min(Math.max(km, 0), MAX_RADIUS_KM);
}

export function setVisibilityRadiusKm(km: number): void {
  const clamped = Math.min(Math.max(km, 0), MAX_RADIUS_KM);
  localStorage.setItem(RADIUS_KEY, String(clamped));
}

const AUTH_KEY = "neardrop-auth";

export function clearAccountData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(PROFILE_IMAGE_KEY);
  localStorage.removeItem(RADIUS_KEY);
}
