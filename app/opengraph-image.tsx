import { ImageResponse } from "next/og";
export const alt = "AI Starter Kit: which AI tool should I use?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#fbfaf7", color: "#16181d" }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>AI Starter <span style={{ background: "#fde68a", padding: "0 12px", borderRadius: 10, marginLeft: 8 }}>Kit</span></div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, marginTop: 30, letterSpacing: -2 }}>What do you want AI to help with?</div>
        <div style={{ fontSize: 34, color: "#5b6170", marginTop: 26 }}>Beginner AI tools by task · how to start in 5 minutes · is the free plan enough?</div>
        <div style={{ display: "flex", gap: 16, marginTop: 40, fontSize: 30 }}>
          {["✍️ Write", "📊 Slides", "🎬 Video", "📚 Study", "🎨 Images"].map((t) => <div key={t} style={{ background: "#fff", border: "2px solid #e7e4dc", borderRadius: 16, padding: "10px 20px" }}>{t}</div>)}
        </div>
      </div>
    ),
    size
  );
}
