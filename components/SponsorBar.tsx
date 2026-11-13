"use client";
import { useEffect, useState } from "react";

export default function SponsorBar({ text, href, label, id }: { text: string; href: string; label: string; id: string }) {
  const key = "sbar-closed-" + id;
  // Render open on the first paint so the header is not pushed down after
  // hydration (layout shift). Only after hydration do we check whether this
  // visitor already dismissed the bar, and hide it then.
  const [open, setOpen] = useState(true);
  useEffect(() => { try { if (localStorage.getItem(key) === "1") setOpen(false); } catch {} }, [key]);
  if (!open) return null;
  return (
    <div className="sbar" role="region" aria-label="Sponsor">
      <div className="wrap">
        <div><span className="lbl">{label}</span>{text} <a href={href}>Learn more →</a></div>
        <button aria-label="Close sponsor bar" onClick={() => { setOpen(false); try { localStorage.setItem(key, "1"); } catch {} }}>×</button>
      </div>
    </div>
  );
}
