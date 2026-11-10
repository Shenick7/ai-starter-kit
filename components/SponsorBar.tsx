"use client";
import { useEffect, useState } from "react";

export default function SponsorBar({ text, href, label, id }: { text: string; href: string; label: string; id: string }) {
  const key = "sbar-closed-" + id;
  const [open, setOpen] = useState(false);
  useEffect(() => { try { setOpen(localStorage.getItem(key) !== "1"); } catch { setOpen(true); } }, [key]);
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
