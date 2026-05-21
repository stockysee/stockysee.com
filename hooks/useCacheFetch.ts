import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching data with session caching and smooth mutations
 * Now supports global refresh signals via CustomEvents
 */
export function useCacheFetch<T>(url: string | null, cacheKey: string, ttl: number = 0) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [lastFetched, setLastFetched] = useState<number>(0);

  const fetchData = useCallback(async (silent = false, force = false) => {
    if (!url || typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // Check TTL if not forced
    const now = Date.now();
    if (!force && ttl > 0 && lastFetched > 0 && (now - lastFetched) < ttl) {
      return;
    }

    if (!silent) setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const err = new Error(errorData.error || "Fetch failed") as any;
        err.status = res.status;
        throw err;
      }
      
      const result = await res.json();
      
      // Keamanan Multi-Tenant Cache Leak:
      // Bersihkan seluruh sessionStorage dan muat ulang halaman jika terdeteksi pergantian akun client
      if (url === "/api/profile" && result?.id && typeof window !== "undefined") {
        const cachedClientId = sessionStorage.getItem("current_logged_in_client_id");
        if (cachedClientId && cachedClientId !== result.id) {
          console.warn("[Cache Security] Akun client berubah dari " + cachedClientId + " ke " + result.id + ". Membersihkan cache dan memuat ulang halaman.");
          sessionStorage.clear();
          window.location.reload();
          return;
        }
        sessionStorage.setItem("current_logged_in_client_id", result.id);
      }
      
      // Update cache and state
      if (typeof window !== "undefined") sessionStorage.setItem(cacheKey, JSON.stringify(result));
      setData(result);
      setError(null); // Clear previous errors
      setLastFetched(Date.now());
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, cacheKey]);

  useEffect(() => {
    if (!url || typeof window === "undefined") return;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsedData = JSON.parse(cached);
        setData(parsedData);
        setLoading(false);
        
        // Check TTL before background refresh
        const now = Date.now();
        // IMPORTANT: We use a local check, not lastFetched in dependency array to avoid loops
        if (ttl > 0 && lastFetched > 0 && (now - lastFetched) < ttl) {
          return;
        }
      } catch (e) {
        sessionStorage.removeItem(cacheKey);
      }
      // Background refresh after loading from cache
      fetchData(true, false);
    } else {
      fetchData(false, false);
    }
    // We REMOVE lastFetched from dependencies to stop the infinite loop
  }, [url, cacheKey, fetchData, ttl]);

  // Global Refresh Listener
  useEffect(() => {
    const handleGlobalRefresh = () => {
      fetchData(true, true); // Force refresh on global signal
    };

    if (typeof window === "undefined") return;
    window.addEventListener("dashboard-refresh", handleGlobalRefresh);
    return () => {
      window.removeEventListener("dashboard-refresh", handleGlobalRefresh);
    };
  }, [fetchData]);

  // Function to manually update local state (Optimistic UI)
  const mutate = (newData: T | ((prev: T | null) => T)) => {
    if (typeof newData === "function") {
      setData((prev) => {
        const result = (newData as Function)(prev);
        if (typeof window !== "undefined") sessionStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      });
    } else {
      setData(newData);
      if (typeof window !== "undefined") sessionStorage.setItem(cacheKey, JSON.stringify(newData));
    }
  };

  return { data, loading, error, mutate, refresh: (force = true) => fetchData(true, force) };
}
