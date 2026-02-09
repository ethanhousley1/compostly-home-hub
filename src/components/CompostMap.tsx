import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const locations = [
  { name: "Downtown Community Garden", lat: 40.7128, lng: -74.006, desc: "Open Mon-Sat, free drop-off" },
  { name: "Green Acres Composting", lat: 40.735, lng: -73.99, desc: "Weekly workshops available" },
  { name: "Riverside Compost Hub", lat: 40.72, lng: -74.015, desc: "Accepts food scraps & yard waste" },
  { name: "Sunset Park Compost", lat: 40.645, lng: -74.012, desc: "Volunteer-run, weekends only" },
  { name: "Brooklyn Botanic Garden", lat: 40.669, lng: -73.963, desc: "Educational programs & drop-off" },
];

const CompostMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.71, -73.99], 12);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:hsl(142,30%,28%);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🌱</div>`,
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    locations.forEach((loc) => {
      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${loc.name}</strong><br/><span style="color:#666">${loc.desc}</span>`);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full" />;
};

export default CompostMap;
