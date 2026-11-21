import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/lib/brand";
import { clampTitle } from "@/lib/og";

const c = brand.colors;
const font = (f: string) => readFile(join(process.cwd(), "assets/fonts", f));

// Fila de azulejos: rombo amarillo sobre cuadro blanco, a la Talavera.
function Tiles({ count, size }: { count: number; size: number }) {
  return (
    <div style={{ display: "flex" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: size, height: size, background: i % 2 ? c.white : c.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: size * 0.45, height: size * 0.45, background: i % 2 ? c.cobalt : c.yellow, transform: "rotate(45deg)", borderRadius: size * 0.06 }} />
        </div>
      ))}
    </div>
  );
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const story = q.get("format") === "story";
  const W = 1080;
  const H = story ? 1920 : 1080;
  const title = clampTitle(q.get("title") || "Evento tech en Puebla");
  const [display, display600, sans, sans600] = await Promise.all([
    font("bricolage-grotesque-latin-800-normal.ttf"),
    font("bricolage-grotesque-latin-600-normal.ttf"),
    font("inter-latin-400-normal.ttf"),
    font("inter-latin-600-normal.ttf"),
  ]);
  const tile = 108;

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", flexDirection: "column", background: c.cobalt, color: c.white, fontFamily: "Inter" }}>
        <Tiles count={W / tile} size={tile} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: story ? "120px 90px" : "70px 80px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignSelf: "flex-start", background: c.yellow, color: c.cobaltDark, fontFamily: "Bricolage", fontWeight: 600, fontSize: story ? 40 : 30, padding: "10px 26px", borderRadius: 999 }}>
              {q.get("community")}
            </div>
            <div style={{ display: "flex", fontFamily: "Bricolage", fontWeight: 800, fontSize: story ? 120 : title.length > 40 ? 76 : 92, lineHeight: 1.02, marginTop: story ? 60 : 40, letterSpacing: -2 }}>
              {title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: story ? 24 : 12 }}>
            <div style={{ display: "flex", fontFamily: "Bricolage", fontWeight: 800, fontSize: story ? 80 : 58, color: c.yellow }}>
              {q.get("date")} · {q.get("time")}
            </div>
            <div style={{ display: "flex", fontSize: story ? 44 : 32, fontWeight: 600, opacity: 0.9 }}>📍 {q.get("venue")}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: story ? 80 : 30, paddingTop: story ? 40 : 24, borderTop: `3px solid rgba(255,255,255,0.25)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: story ? 72 : 56, height: story ? 72 : 56, borderRadius: 999, background: c.yellow, color: c.cobaltDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Bricolage", fontWeight: 800, fontSize: story ? 44 : 34 }}>c</div>
                <div style={{ display: "flex", fontFamily: "Bricolage", fontWeight: 800, fontSize: story ? 56 : 42 }}>cemita</div>
              </div>
              <div style={{ display: "flex", fontSize: story ? 32 : 24, opacity: 0.8 }}>eventos tech de Puebla</div>
            </div>
          </div>
        </div>
        <Tiles count={W / tile} size={tile} />
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "Bricolage", data: display, weight: 800, style: "normal" },
        { name: "Bricolage", data: display600, weight: 600, style: "normal" },
        { name: "Inter", data: sans, weight: 400, style: "normal" },
        { name: "Inter", data: sans600, weight: 600, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=3600" },
    },
  );
}
