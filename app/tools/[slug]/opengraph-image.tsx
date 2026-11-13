import { ImageResponse } from "next/og";
import { getEntries, getEntry } from "@/lib/db";
import { VERDICT_LABEL } from "@/lib/tools";

export const alt = "AI Starter Kit tool page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getEntries()).map((e) => ({ slug: e.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getEntry((await params).slug);
  const name = t?.name ?? "AI Starter Kit";
  const tagline = t?.tagline ?? "Which AI tool should I use?";
  const verdict = t ? VERDICT_LABEL[t.verdict] : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fbfaf7", color: "#16181d" }}>
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>AI Starter <span style={{ background: "#fde68a", padding: "0 12px", borderRadius: 10, marginLeft: 8 }}>Kit</span></div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.02, marginTop: 34, letterSpacing: -2 }}>{name}</div>
        <div style={{ fontSize: 34, color: "#5b6170", marginTop: 24, lineHeight: 1.3 }}>{tagline}</div>
        {verdict && <div style={{ display: "flex", marginTop: 36 }}><div style={{ background: "#dcfce7", color: "#15803d", fontSize: 30, fontWeight: 700, borderRadius: 999, padding: "10px 24px" }}>{verdict}</div></div>}
        <div style={{ fontSize: 28, color: "#5b6170", marginTop: 36 }}>How to start in 5 minutes · aikitstart.com</div>
      </div>
    ),
    size
  );
}
