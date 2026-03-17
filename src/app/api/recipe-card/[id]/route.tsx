import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Ingredient } from "@/lib/types";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const W = 1080;
const H = 1350;

function loadFont(): ArrayBuffer {
  const fontPath = path.join(
    process.cwd(),
    "node_modules/@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff",
  );
  const buf = fs.readFileSync(fontPath);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("title, category, time, method, ingredients, notes")
    .eq("id", id)
    .single();

  if (!recipe) return new Response("Not found", { status: 404 });

  const ingredients = (recipe.ingredients as Ingredient[]) ?? [];
  const shown = ingredients.slice(0, 8);
  const extra = ingredients.length - shown.length;

  const fontData = loadFont();
  const fonts = [{ name: "Playfair Display", data: fontData, weight: 700 as const }];

  const titleSize =
    recipe.title.length > 40 ? 68 : recipe.title.length > 25 ? 84 : 100;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${W}px`,
          height: `${H}px`,
          backgroundColor: "#fafaf9",
          display: "flex",
          flexDirection: "column",
          padding: "80px 88px",
          justifyContent: "space-between",
        }}
      >
        {/* Header: branding */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "Playfair Display",
              fontSize: "24px",
              color: "#a8a29e",
              letterSpacing: "0.06em",
            }}
          >
            Recipear
          </span>
          {/* Metadata pills */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {recipe.category && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#78716c",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  border: "1px solid #e7e5e4",
                  borderRadius: "999px",
                  padding: "5px 16px",
                }}
              >
                {recipe.category}
              </span>
            )}
            {recipe.time && (
              <span
                style={{
                  fontSize: "14px",
                  color: "#78716c",
                  border: "1px solid #e7e5e4",
                  borderRadius: "999px",
                  padding: "5px 16px",
                }}
              >
                {recipe.time}
              </span>
            )}
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontFamily: "Playfair Display",
              fontSize: `${titleSize}px`,
              color: "#1c1917",
              lineHeight: 1.1,
              margin: 0,
              padding: 0,
            }}
          >
            {recipe.title}
          </h1>
          {recipe.notes && (
            <p
              style={{
                fontSize: "20px",
                color: "#a8a29e",
                margin: 0,
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              {recipe.notes.length > 120 ? recipe.notes.slice(0, 120) + "…" : recipe.notes}
            </p>
          )}
        </div>

        {/* Ingredients */}
        {shown.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "#d6d3d1",
                marginBottom: "28px",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#a8a29e",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                marginBottom: "20px",
              }}
            >
              Ingredientes
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {shown.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    marginBottom: "16px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#d6d3d1", flexShrink: 0 }}>—</span>
                  <span style={{ fontSize: "22px", color: "#57534e", lineHeight: 1.3 }}>
                    {[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                  </span>
                </div>
              ))}
              {extra > 0 && (
                <span style={{ fontSize: "18px", color: "#a8a29e", marginLeft: "24px", marginTop: "4px" }}>
                  + {extra} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "28px",
            borderTop: "1px solid #f0ece8",
          }}
        >
          <span style={{ fontSize: "14px", color: "#c4b5a5", letterSpacing: "0.06em" }}>
            Tu recetario digital
          </span>
          <span style={{ fontSize: "14px", color: "#c4b5a5", letterSpacing: "0.06em" }}>
            recipear.com
          </span>
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts,
    },
  );
}
