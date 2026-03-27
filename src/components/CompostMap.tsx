import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeAddress, isCached } from "@/lib/geocode";
import { Loader2 } from "lucide-react";

export interface CompostLocation {
  location_id: number;
  address: string;
}

interface GeocodedLocation extends CompostLocation {
  lat: number;
  lng: number;
}

interface CompostMapProps {
  locations: CompostLocation[];
}

function escapeHtml(text: string): string {
  const el = document.createElement("span");
  el.textContent = text;
  return el.innerHTML;
}

const CompostMap = ({ locations }: CompostMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [geocodedLocations, setGeocodedLocations] = useState<GeocodedLocation[]>([]);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState({ done: 0, total: 0 });

  // Geocode location addresses
  useEffect(() => {
    const withAddress = locations.filter((l) => l.address?.trim());
    if (withAddress.length === 0) {
      setGeocodedLocations([]);
      setGeocoding(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setGeocoding(true);
      setGeocodeProgress({ done: 0, total: withAddress.length });
      const results: GeocodedLocation[] = [];

      for (let i = 0; i < withAddress.length; i++) {
        if (cancelled) return;

        const loc = withAddress[i];
        const wasCached = isCached(loc.address);
        const coords = await geocodeAddress(loc.address);

        if (coords) {
          results.push({ ...loc, lat: coords.lat, lng: coords.lng });
        }

        setGeocodeProgress({ done: i + 1, total: withAddress.length });

        if (!wasCached && i < withAddress.length - 1) {
          await new Promise((r) => setTimeout(r, 1100));
        }
      }

      if (!cancelled) {
        setGeocodedLocations(results);
        setGeocoding(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locations]);

  // Initialise Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.71, -73.99], 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render markers whenever geocoded data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersRef.current) markersRef.current.clearLayers();

    const layer = L.layerGroup().addTo(map);
    markersRef.current = layer;

    if (geocodedLocations.length === 0) return;

    const icon = L.divIcon({
      html: '<div style="background:hsl(142,30%,28%);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🌱</div>',
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    geocodedLocations.forEach((loc) => {
      const addr = escapeHtml(loc.address);

      L.marker([loc.lat, loc.lng], { icon })
        .bindPopup(
          `<div style="min-width:180px">
             <p style="font-weight:600;font-size:14px;margin:0 0 4px">Composting Location</p>
             <p style="font-size:12px;color:#6b7280;margin:0">${addr}</p>
           </div>`,
        )
        .addTo(layer);
    });

    const bounds = L.latLngBounds(
      geocodedLocations.map((l) => [l.lat, l.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [geocodedLocations]);

  return (
    <div className="relative h-full w-full">
      {geocoding && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-gray-600">
              Geocoding locations… {geocodeProgress.done}/{geocodeProgress.total}
            </p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
};

export default CompostMap;
