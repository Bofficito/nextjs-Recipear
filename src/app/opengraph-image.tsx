import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const alt = "Recipear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function loadFont(): ArrayBuffer {
  const fontPath = path.join(
    process.cwd(),
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff",
  );
  const buf = fs.readFileSync(fontPath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export default function OGImage() {
  const fontData = loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "#fafaf9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
        }}
      >
        {/* Línea izquierda */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 80,
            bottom: 80,
            width: "1px",
            backgroundColor: "#e7e5e4",
          }}
        />

        {/* Líneas decorativas derecha */}
        <div
          style={{
            position: "absolute",
            right: 120,
            top: "50%",
            display: "flex",
            gap: "14px",
            transform: "translateY(-50%)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "3px",
                height: `${80 - i * 20}px`,
                backgroundColor: "#e7e5e4",
                borderRadius: "2px",
              }}
            />
          ))}
        </div>

        {/* Contenido */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingLeft: "32px" }}>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: "120px",
              color: "#1c1917",
              margin: 0,
              padding: 0,
              lineHeight: 1,
            }}
          >
            Recipear
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#44403c",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            Tu recetario personal.
          </p>
          <p
            style={{
              fontSize: "24px",
              color: "#a8a29e",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Guardá, organizá y cocinás tus recetas{"\n"}desde cualquier dispositivo.
          </p>
        </div>

        {/* Badge dominio */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 100,
            backgroundColor: "#1c1917",
            color: "#fafaf9",
            borderRadius: "999px",
            padding: "12px 24px",
            fontSize: "20px",
            letterSpacing: "0.02em",
          }}
        >
          recipear.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Playfair Display", data: fontData, weight: 700 }],
    },
  );
}
