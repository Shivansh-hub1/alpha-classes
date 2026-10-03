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
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          padding: 80,
          fontFamily: "sans-serif",
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
          <div style={{ color: "#fff", fontSize: 34, fontWeight: 800, letterSpacing: 1 }}>ALPHA CLASSES</div>
        </div>
        <div style={{ color: "#fff", fontSize: 68, fontWeight: 900, marginTop: 40, lineHeight: 1.1, letterSpacing: -2 }}>
          Learn Today.
        </div>
        <div style={{ color: "#ff6b00", fontSize: 68, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
          Lead Tomorrow.
        </div>
        <div style={{ color: "#9aa3b2", fontSize: 26, marginTop: 34 }}>
          Live classes · Test series · Study material · Doubt support
        </div>
      </div>
    ),
    size
  );
}
