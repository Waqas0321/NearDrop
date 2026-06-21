const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isWithinRadius(
  viewerLat: number,
  viewerLng: number,
  viewerRadiusKm: number,
  targetLat: number | null,
  targetLng: number | null,
  targetRadiusKm: number
): boolean {
  if (targetLat == null || targetLng == null) return false;
  const distance = haversineDistanceKm(
    viewerLat,
    viewerLng,
    targetLat,
    targetLng
  );
  return distance <= Math.min(viewerRadiusKm, targetRadiusKm);
}

export interface GeolocationResult {
  latitude: number;
  longitude: number;
}

export function getCurrentPosition(): Promise<GeolocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? "Location permission is required to share with nearby devices."
              : "Unable to get your location. Please try again."
          )
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  });
}
