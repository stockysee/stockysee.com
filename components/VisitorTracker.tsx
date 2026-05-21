"use client";

import { useEffect, useRef } from "react";

interface VisitorTrackerProps {
  clientId: string;
}

export default function VisitorTracker({ clientId }: VisitorTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Cegah double tracking di mode development (StrictMode)
    if (hasTracked.current) return;

    const trackVisit = async () => {
      try {
        hasTracked.current = true;
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId }),
        });
      } catch (error) {
        console.error("Tracking error:", error);
      }
    };

    if (clientId) {
      trackVisit();
    }
  }, [clientId]);

  return null; // Invisible component
}
