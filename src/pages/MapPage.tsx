import { useEffect, useState, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabase";
import { geocodeAddress, isCached } from "@/lib/geocode";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EditUserDialog, { type UserRecord } from "@/components/EditUserDialog";
import AdminSubNav from "@/components/AdminSubNav";

interface UserWithCoords extends UserRecord {
  lat: number;
  lng: number;
}

function escapeHtml(text: string): string {
  const el = document.createElement("span");
  el.textContent = text;
  return el.innerHTML;
}

const MapPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [geocodedUsers, setGeocodedUsers] = useState<UserWithCoords[]>([]);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeProgress, setGeocodeProgress] = useState({
    done: 0,
    total: 0,
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_account")
        .select(
          "user_id, first_name, last_name, email, address, pickup_or_dropoff, email_notifications, weekly_reminders",
        )
        .order("user_id", { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch users",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Geocode user addresses (respects Nominatim 1 req/s rate limit)
  useEffect(() => {
    const usersWithAddress = users.filter((u) => u.address?.trim());
    if (usersWithAddress.length === 0) {
      setGeocodedUsers([]);
      setGeocoding(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setGeocoding(true);
      setGeocodeProgress({ done: 0, total: usersWithAddress.length });
      const results: UserWithCoords[] = [];

      for (let i = 0; i < usersWithAddress.length; i++) {
        if (cancelled) return;

        const user = usersWithAddress[i];
        const wasCached = isCached(user.address!);
        const coords = await geocodeAddress(user.address!);

        if (coords) {
          results.push({ ...user, lat: coords.lat, lng: coords.lng });
        }

        setGeocodeProgress({ done: i + 1, total: usersWithAddress.length });

        if (!wasCached && i < usersWithAddress.length - 1) {
          await new Promise((r) => setTimeout(r, 1100));
        }
      }

      if (!cancelled) {
        setGeocodedUsers(results);
        setGeocoding(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [users]);

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

    if (geocodedUsers.length === 0) return;

    const icon = L.divIcon({
      html: '<div style="background:hsl(142,30%,28%);width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🌱</div>',
      className: "",
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    geocodedUsers.forEach((user) => {
      const name = escapeHtml(`${user.first_name} ${user.last_name}`);
      const addr = escapeHtml(user.address ?? "");

      L.marker([user.lat, user.lng], { icon })
        .bindPopup(
          `<div style="min-width:180px">
             <p style="font-weight:600;font-size:14px;margin:0 0 4px">${name}</p>
             <p style="font-size:12px;color:#6b7280;margin:0 0 12px">${addr}</p>
             <button
               data-edit-user-id="${user.user_id}"
               style="width:100%;padding:6px 12px;font-size:12px;font-weight:500;color:#fff;background:hsl(142,30%,28%);border:none;border-radius:6px;cursor:pointer;"
               onmouseover="this.style.opacity='0.9'"
               onmouseout="this.style.opacity='1'"
             >Edit Account</button>
           </div>`,
        )
        .addTo(layer);
    });

    const bounds = L.latLngBounds(
      geocodedUsers.map((u) => [u.lat, u.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [geocodedUsers]);

  // Event delegation: handle "Edit Account" button clicks inside Leaflet popups
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-edit-user-id]",
      );
      if (!btn) return;

      const id = parseInt(btn.dataset.editUserId!, 10);
      const user = users.find((u) => u.user_id === id);
      if (user) {
        mapInstanceRef.current?.closePopup();
        setSelectedUser(user);
        setEditDialogOpen(true);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [users]);

  const handleEditSuccess = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const usersWithAddress = users.filter((u) => u.address?.trim());

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            User Map
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            View all user addresses on the map. Click a pin to view details or
            edit.
          </p>
        </div>
        <AdminSubNav />
        <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white">
          {(loading || geocoding) && (
            <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-gray-600">
                  {loading
                    ? "Loading users…"
                    : `Geocoding addresses… ${geocodeProgress.done}/${geocodeProgress.total}`}
                </p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="h-[600px] w-full" />
        </div>

        {!loading && !geocoding && geocodedUsers.length === 0 && users.length > 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">
            No users with geocodable addresses to display on the map.
          </p>
        )}

        {!loading && !geocoding && geocodedUsers.length > 0 && (
          <p className="mt-4 text-center text-sm text-gray-500">
            Showing {geocodedUsers.length} of {usersWithAddress.length} users
            with addresses
          </p>
        )}
      </div>

      <EditUserDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default MapPage;
