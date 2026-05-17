"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isSupabaseSchemaReady } from "@/lib/supabase/ready";

export function useSupabaseBackend() {
  const configured = isSupabaseConfigured();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(configured);

  useEffect(() => {
    if (!configured) {
      setReady(false);
      setChecking(false);
      return;
    }
    let cancelled = false;
    isSupabaseSchemaReady().then((ok) => {
      if (!cancelled) {
        setReady(ok);
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [configured]);

  return { configured, ready, checking, active: configured && ready };
}
