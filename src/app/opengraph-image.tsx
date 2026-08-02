import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Default social-share card, generated at build time rather than shipped as a
 * binary. Every page inherits this unless it sets its own `images`.
 *
 * Kept to system-font stacks and flat colour: `ImageResponse` has no network
 * access for webfonts here, and gradients/filters are only partially supported
 * by Satori.
 */
export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
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
          justifyContent: "space-between",
          background: "#05070a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Accent rule */}
        <div style={{ display: "flex", width: 160, height: 8, background: "#14b8a6" }} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#14b8a6",
              fontWeight: 700,
            }}
          >
            Telecom · Railways · Defence
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 74,
              lineHeight: 1.08,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Engineering the Networks That Keep India Moving
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #1f2937",
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", fontSize: 40, fontWeight: 800, color: "#ffffff" }}>
            TELOGICA LIMITED
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#94a3b8" }}>
            ISO 9001:2015 · {site.bse}
          </div>
        </div>
      </div>
    ),
    size
  );
}
