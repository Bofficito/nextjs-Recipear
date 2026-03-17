import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Ingredient, Tag } from "@/lib/types";

const s = StyleSheet.create({
  // — Portada —
  coverPage: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    backgroundColor: "#1c1917",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  coverBorder: {
    position: "absolute",
    top: 24,
    left: 24,
    right: 24,
    bottom: 24,
    borderWidth: 1,
    borderColor: "#44403c",
  },
  coverLabel: {
    fontSize: 9,
    color: "#78716c",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginBottom: 20,
  },
  coverDivider: {
    width: 32,
    height: 1,
    backgroundColor: "#44403c",
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: 38,
    color: "#fafaf9",
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  coverUser: {
    fontSize: 12,
    color: "#a8a29e",
    textAlign: "center",
  },
  coverFooter: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  coverCount: {
    fontSize: 10,
    color: "#57534e",
    textAlign: "center",
  },
  coverDate: {
    fontSize: 9,
    color: "#44403c",
    textAlign: "center",
    letterSpacing: 1,
  },
  // — Páginas interiores —
  page: {
    paddingTop: 56,
    paddingBottom: 52,
    paddingHorizontal: 60,
    backgroundColor: "#fafaf9",
    fontFamily: "Helvetica",
  },
  // — Índice —
  indexPageTitle: {
    fontSize: 9,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 28,
  },
  categoryGroup: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 8,
    color: "#c4b5a5",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },
  indexEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
  },
  indexTitle: {
    fontSize: 11,
    color: "#1c1917",
    flex: 1,
  },
  indexMeta: {
    fontSize: 9,
    color: "#a8a29e",
    marginLeft: 8,
  },
  // — Receta —
  recipeHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
  },
  recipeTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  meta: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  metaText: {
    fontSize: 8,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  recipeCounter: {
    fontSize: 9,
    color: "#d6d3d1",
    letterSpacing: 1,
  },
  pageTitle: {
    fontSize: 26,
    color: "#1c1917",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    lineHeight: 1.2,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
    marginBottom: 4,
  },
  tag: {
    fontSize: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    color: "#78716c",
    backgroundColor: "#f5f5f4",
  },
  notes: {
    fontSize: 10,
    color: "#78716c",
    fontStyle: "italic",
    backgroundColor: "#f5f5f4",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 8,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 10,
  },
  ingredient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#d6d3d1",
  },
  ingredientText: {
    fontSize: 11,
    color: "#44403c",
  },
  condiments: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  condimentPill: {
    fontSize: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#f5f5f4",
    color: "#78716c",
  },
  steps: {
    fontSize: 11,
    color: "#44403c",
    lineHeight: 1.75,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#d6d3d1",
    letterSpacing: 0.5,
  },
});

type Recipe = {
  id: string;
  title: string;
  category: string;
  method?: string | null;
  time?: string | null;
  notes?: string | null;
  steps?: string | null;
  ingredients: Ingredient[];
  condiments?: string[];
  tags: Tag[];
};

type Props = {
  recipes: Recipe[];
  userName: string;
};

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function BookPDF({ recipes, userName }: Props) {
  const now = new Date();
  const dateLabel = `${MONTHS_ES[now.getMonth()]} ${now.getFullYear()}`.toUpperCase();

  // Group by category for index
  const grouped: Record<string, Recipe[]> = {};
  for (const r of recipes) {
    const cat = r.category || "Sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(r);
  }

  return (
    <Document>
      {/* Portada */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverBorder} />
        <Text style={s.coverLabel}>Recipear</Text>
        <View style={s.coverDivider} />
        <Text style={s.coverTitle}>Mi Recetario</Text>
        <View style={s.coverFooter}>
          <Text style={s.coverCount}>
            {recipes.length} receta{recipes.length !== 1 ? "s" : ""}
          </Text>
          <Text style={s.coverDate}>{dateLabel}</Text>
        </View>
      </Page>

      {/* Índice agrupado por categoría */}
      <Page size="A4" style={s.page}>
        <Text style={s.indexPageTitle}>Índice</Text>
        {Object.entries(grouped).map(([cat, items]) => (
          <View key={cat} style={s.categoryGroup}>
            <Text style={s.categoryHeader}>{cat}</Text>
            {items.map((r) => (
              <View key={r.id} style={s.indexEntry}>
                <Text style={s.indexTitle}>{r.title}</Text>
                <Text style={s.indexMeta}>
                  {r.time ?? ""}
                </Text>
              </View>
            ))}
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Recipear</Text>
        </View>
      </Page>

      {/* Una página por receta */}
      {recipes.map((recipe, index) => {
        const ingredients = recipe.ingredients as Ingredient[];
        const metaParts = [recipe.category, recipe.method, recipe.time].filter(Boolean);
        const counter = `${String(index + 1).padStart(2, "0")} / ${String(recipes.length).padStart(2, "0")}`;

        return (
          <Page key={recipe.id} size="A4" style={s.page}>
            <View style={s.recipeHeader}>
              <View style={s.recipeTopRow}>
                <View style={s.meta}>
                  {metaParts.map((p, i) => (
                    <Text key={i} style={s.metaText}>{p}</Text>
                  ))}
                </View>
                <Text style={s.recipeCounter}>{counter}</Text>
              </View>
              <Text style={s.pageTitle}>{recipe.title}</Text>
              {recipe.tags?.length > 0 && (
                <View style={s.tags}>
                  {recipe.tags.map((tag) => (
                    <Text key={tag.id} style={s.tag}>{tag.name}</Text>
                  ))}
                </View>
              )}
              {recipe.notes && <Text style={s.notes}>{recipe.notes}</Text>}
            </View>

            {ingredients.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Ingredientes</Text>
                {ingredients.map((ing, i) => (
                  <View key={i} style={s.ingredient}>
                    <View style={s.dot} />
                    <Text style={s.ingredientText}>
                      {[ing.qty, ing.unit, ing.name].filter(Boolean).join(" ")}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {recipe.condiments && recipe.condiments.length > 0 && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Condimentos / a gusto</Text>
                <View style={s.condiments}>
                  {recipe.condiments.map((c, i) => (
                    <Text key={i} style={s.condimentPill}>{c}</Text>
                  ))}
                </View>
              </View>
            )}

            {recipe.steps && (
              <View style={s.section}>
                <Text style={s.sectionTitle}>Preparación</Text>
                <Text style={s.steps}>{recipe.steps}</Text>
              </View>
            )}

            <View style={s.footer} fixed>
              <Text style={s.footerText}>Recipear</Text>
              <Text style={s.footerText}>{counter}</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
