"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Pageview() {
  const path = usePathname();
  useEffect(() => {
    const body = JSON.stringify({ path, ref: document.referrer || null });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/pv", new Blob([body], { type: "application/json" }));
    else fetch("/api/pv", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
  }, [path]);
  return null;
}
