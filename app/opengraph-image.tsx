import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Saksham Jain — Full-Stack Engineer & Systems Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load DM Sans static cuts so Satori can render text at chosen weights.
async function loadFont(file: string) {
  return fetch(
    new URL(`../public/fonts/DM_Sans/static/${file}`, import.meta.url),
  ).then((r) => r.arrayBuffer());
}

export default async function OpengraphImage() {
  const [regular, bold, extraBold] = await Promise.all([
    loadFont("DMSans-Regular.ttf"),
    loadFont("DMSans-Bold.ttf"),
    loadFont("DMSans-ExtraBold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #000319 0%, #1E1B4B 60%, #3B0764 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "white",
          fontFamily: "DM Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 22,
            letterSpacing: 6,
            opacity: 0.7,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: "#CBACF9",
            }}
          />
          sakshamjain.codes
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Saksham Jain
          </div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 500,
              opacity: 0.85,
              maxWidth: 900,
            }}
          >
            Full-Stack Engineer · Systems Architect
          </div>
          <div
            style={{
              fontSize: 24,
              opacity: 0.65,
              maxWidth: 900,
            }}
          >
            PRD → HLD → ship → operate. Eight live sub-products.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            opacity: 0.55,
          }}
        >
          <div>Next.js · TypeScript · MongoDB · NextAuth · MDX</div>
          <div>@Saksham_Jain007</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "DM Sans", data: regular, weight: 400, style: "normal" },
        { name: "DM Sans", data: bold, weight: 700, style: "normal" },
        { name: "DM Sans", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
