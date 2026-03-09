import { NextRequest, NextResponse } from "next/server";
import { getRecipe } from "@/lib/actions/recipes";
import { getRecipeTags } from "@/lib/actions/tags";
import { createClient } from "@/lib/supabase/server";
import { renderToStream } from "@react-pdf/renderer";
import { RecipePDF } from "@/components/pdf/RecipePDF";
import type { Ingredient, Tag } from "@/lib/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const [recipe, tags] = await Promise.all([getRecipe(id), getRecipeTags(id)]);

  if (!recipe)
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });

  const stream = await renderToStream(
    RecipePDF({
      recipe,
      ingredients: recipe.ingredients as Ingredient[],
      tags,
    }),
  );

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${recipe.title}.pdf"`,
    },
  });
}
