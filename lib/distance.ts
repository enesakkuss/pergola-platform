/**
 * lib/distance.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Haversine formülü ile iki coğrafi koordinat arasındaki
 * büyük daire (great-circle) mesafesini kilometre cinsinden hesaplar.
 *
 * @param lat1  Birinci noktanın enlemi  (derece)
 * @param lon1  Birinci noktanın boylamı (derece)
 * @param lat2  İkinci noktanın enlemi   (derece)
 * @param lon2  İkinci noktanın boylamı  (derece)
 * @returns     Mesafe (km), 2 ondalık basamağa yuvarlanmış
 *
 * Örnek:
 *   haversineDistance(41.015, 28.979, 39.925, 32.866) // İstanbul → Ankara ≈ 353 km
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Dünya yarıçapı (km)

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 100) / 100; // km, 2 ondalık
}

/**
 * Tarayıcı Geolocation API'sini kullanarak kullanıcının mevcut konumunu alır.
 * Hata durumunda null döner.
 */
export async function getUserCoordinates(): Promise<{
  lat: number;
  lon: number;
} | null> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}
