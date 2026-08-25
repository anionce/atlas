import { ImageResponse } from "next/og";

export const alt = "Mi Rumbo Financiero — Toma mejores decisiones financieras";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fbf7f4",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 88,
          height: 88,
          borderRadius: 24,
          backgroundColor: "#6c9a8b",
          marginBottom: 40,
        }}
      >
        <div style={{ fontSize: 48, color: "#fbf7f4", fontWeight: 700 }}>€</div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          color: "#2a2420",
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        Mi Rumbo Financiero
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#6b5f56",
          marginTop: 24,
          textAlign: "center",
          padding: "0 120px",
        }}
      >
        Toma mejores decisiones financieras
      </div>
    </div>,
    { ...size },
  );
}
