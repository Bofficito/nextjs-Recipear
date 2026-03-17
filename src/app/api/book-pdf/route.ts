import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import { BookPDF } from "@/components/pdf/BookPDF";
import { getRecipesForExport } from "@/lib/actions/recipes";
import type { Ingredient, Tag } from "@/lib/types";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { ids } = (await req.json()) as { ids: string[] };
  if (!ids?.length)
    return NextResponse.json({ error: "Sin recetas" }, { status: 400 });

  const selected = await getRecipesForExport(ids);

  const stream = await renderToStream(
    BookPDF({ recipes: selected, userName: user.email ?? "" }),
  );

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="mi-recetario.pdf"',
    },
  });
}
