"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Short cookie/privacy notice. Shows once until dismissed; the choice is
// stored only in the visitor's own browser.
export default function CookieNotice() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem("cookie-ok")) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;
  function dismiss() {
    try {
      localStorage.setItem("cookie-ok", "1");
    } catch {}
    setShow(false);
  }
  return (
    <div className="cookiebar" role="region" aria-label="Cookie notice">
      <div className="wrap">
        <p>
          We use privacy-friendly analytics to count page visits — no advertising cookies, no
          tracking across sites. <Link href="/privacy">Privacy policy</Link>
        </p>
        <button type="button" className="btn" onClick={dismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
