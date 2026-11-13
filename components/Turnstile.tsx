"use client";
import { useEffect, useRef, useState } from "react";

// Cloudflare Turnstile widget. Renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY
// is not set, so the form works normally until the owner creates keys in
// Cloudflare and adds them in Vercel. The token goes into a hidden input
// inside the same form, so the existing form submit sends it along.
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void; "expired-callback"?: () => void; "error-callback"?: () => void }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // fail open: server skips verification when the widget never loads
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export default function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let widgetId: string | undefined;
    let alive = true;
    loadScript().then(() => {
      if (!alive || !window.turnstile || !ref.current) { setFailed(true); return; }
      try {
        widgetId = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          callback: (t) => setToken(t),
          "expired-callback": () => { setToken(""); if (widgetId) window.turnstile?.reset(widgetId); },
          "error-callback": () => setFailed(true),
        });
      } catch { setFailed(true); }
    });
    return () => { alive = false; if (widgetId) { try { window.turnstile?.remove(widgetId); } catch {} } };
  }, []);

  if (!SITE_KEY || failed) return null;
  return (
    <>
      <div ref={ref} />
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
    </>
  );
}
