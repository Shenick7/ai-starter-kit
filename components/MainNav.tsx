"use client";
import { useState } from "react";
import Link from "next/link";

// Compact mobile navigation: on small screens the links collapse behind a
// single Menu button so the header stays one row and the hero stays visible.
export default function MainNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="menuBtn"
        type="button"
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✕ Close" : "☰ Menu"}
      </button>
      <nav id="main-nav" className={`main${open ? " open" : ""}`} aria-label="Main" onClick={() => setOpen(false)}>
        <Link href="/search">Search</Link>
        <Link href="/tools">All tools</Link>
        <Link href="/learn">Learn</Link>
        <Link href="/prompts">Prompts</Link>
        <Link href="/submit">Submit a tool</Link>
        <Link href="/sponsor">Sponsor</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </>
  );
}
