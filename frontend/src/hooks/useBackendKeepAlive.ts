import { useEffect, useRef } from "react";
import axiosInstance from "../services/connect";

// 14 minutes in milliseconds (Render spins down at 15 minutes of inactivity)
const PING_INTERVAL_MS = 14 * 60 * 1000;

export function useBackendKeepAlive() {
  const lastPingTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let timerId: number | null = null;

    const performPing = async (reason = "scheduled") => {
      try {
        lastPingTimeRef.current = Date.now();
        // Ping the health endpoint silently
        await axiosInstance.get("/health/", {
          headers: {
            "X-Keep-Alive-Ping": "true",
          },
        });
        if (import.meta.env.DEV) {
          console.debug(`[KeepAlive] Backend pinged successfully (${reason}) at`, new Date().toLocaleTimeString());
        }
      } catch (err) {
        // Silently suppress errors so user experience is not disrupted
        if (import.meta.env.DEV) {
          console.debug(`[KeepAlive] Ping failed silently (${reason})`);
        }
      }
    };

    // 1. Initial warm-up ping on mount
    performPing("initial");

    // 2. Scheduled 14-minute interval
    timerId = window.setInterval(() => {
      performPing("interval");
    }, PING_INTERVAL_MS);

    // 3. Visibility change listener (wakes server if user returns after tab was backgrounded)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const timeSinceLastPing = Date.now() - lastPingTimeRef.current;
        if (timeSinceLastPing >= PING_INTERVAL_MS) {
          performPing("tab-activated");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}

export default useBackendKeepAlive;
