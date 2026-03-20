interface GeocodingResult {
  lat: number;
  lng: number;
}

const cache = new Map<string, GeocodingResult | null>();

function cacheKey(address: string): string {
  return address.trim().toLowerCase();
}

export function isCached(address: string): boolean {
  return cache.has(cacheKey(address));
}

export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult | null> {
  const key = cacheKey(address);
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { "User-Agent": "Compostly/1.0 (admin-map)" } },
    );

    if (!res.ok) {
      cache.set(key, null);
      return null;
    }

    const data = await res.json();
    if (!data.length) {
      cache.set(key, null);
      return null;
    }

    const result: GeocodingResult = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
    cache.set(key, result);
    return result;
  } catch {
    cache.set(key, null);
    return null;
  }
}
