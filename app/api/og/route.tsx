import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/lib/brand";
import { clampTitle } from "@/lib/og";

const c = brand.colors;
const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const story = q.get("format") === "story";
  const cancelled = q.get("status") === "cancelado";
  const W = 1080;
  const H = story ? 1920 : 1080;
  const title = clampTitle(q.get("title") || "Evento tech en Puebla");
  const [display, display500, sans, sans600] = await Promise.all([
    font("space-grotesk-latin-700-normal.ttf"),
    font("space-grotesk-latin-500-normal.ttf"),
    font("geist-latin-400-normal.ttf"),
    font("geist-latin-600-normal.ttf"),
  ]);
  const venue = q.get("venue");
  const place = [q.get("community"), venue].filter(Boolean).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: c.bosque,
          color: c.blanco,
          fontFamily: "Geist",
          padding: story ? "140px 90px" : "80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Space Grotesk",
              fontWeight: 500,
              fontSize: story ? 36 : 28,
              letterSpacing: 5,
              color: c.vinoClaro,
            }}
          >
            {cancelled ? "PUE/TECH · CANCELADO" : "PUE/TECH · EVENTO"}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: story ? 120 : title.length > 40 ? 78 : 96,
              lineHeight: 1.04,
              marginTop: story ? 60 : 36,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {cancelled && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: story ? 44 : 34,
                letterSpacing: 4,
                color: c.vinoClaro,
                border: `4px solid ${c.vinoClaro}`,
                borderRadius: 999,
                padding: story ? "14px 36px" : "10px 28px",
                marginBottom: story ? 36 : 24,
              }}
            >
              CANCELADO
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: story ? 16 : 10,
              background: cancelled ? c.cacao : c.vino,
              borderRadius: 24,
              padding: story ? "48px 52px" : "34px 40px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Space Grotesk",
                fontWeight: 700,
                fontSize: story ? 68 : 52,
                textDecoration: cancelled ? "line-through" : "none",
              }}
            >
              {q.get("date")} · {q.get("time")}
            </div>
            <div style={{ display: "flex", fontWeight: 600, fontSize: story ? 40 : 30 }}>{place}</div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Space Grotesk",
              fontWeight: 700,
              fontSize: story ? 56 : 42,
              marginTop: story ? 70 : 44,
            }}
          >
            PUE<span style={{ color: c.vinoClaro }}>/</span>Tech
          </div>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "Space Grotesk", data: display, weight: 700, style: "normal" },
        { name: "Space Grotesk", data: display500, weight: 500, style: "normal" },
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sans600, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
