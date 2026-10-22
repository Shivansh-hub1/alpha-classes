import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #1e2638 100%)",
          padding: 80,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#ff6b00",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#fff", fontSize: 36, fontWeight: 900, letterSpacing: 1 }}>
              ALPHA CLASSES
            </div>
            <div style={{ color: "#ff6b00", fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>
              BIKAPUR, AYODHYA
            </div>
          </div>
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 64,
            fontWeight: 900,
            marginTop: 40,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          Best Coaching in Bikapur.
        </div>
        <div
          style={{
            color: "#ff6b00",
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          Learn Today. Lead Tomorrow.
        </div>

        <div
          style={{
            color: "#a6b1c2",
            fontSize: 24,
            marginTop: 30,
            display: "flex",
            gap: 16,
          }}
        >
          <span>Class 9–10</span>
          <span>·</span>
          <span>JEE</span>
          <span>·</span>
          <span>NEET</span>
          <span>·</span>
          <span>SSC</span>
          <span>·</span>
          <span>Online Test Series</span>
        </div>
      </div>
    ),
    size
  );
}
