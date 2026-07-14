"use client";

import { useState, useEffect } from "react";

/**
 * Parses a custom title from the URL hash fragment (#My_Custom_Title).
 * Safely falls back to the provided default static title on SSR/initial render.
 */
export function useCustomTitle(defaultTitle: string): string {
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setPageTitle(decodeURIComponent(hash).replace(/_/g, " "));
      } else {
        setPageTitle(defaultTitle);
      }
    };

    // Run once on client mount
    handleHashChange();

    // Listen for real-time hash updates
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [defaultTitle]);

  return pageTitle;
}