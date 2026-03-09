import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Ingredient, Tag } from "@/lib/types";

const s = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    backgroundColor: "#fafaf9",
    fontFamily: "Helvetica",
  },
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
  coverTitle: {
    fontSize: 36,
    color: "#fafaf9",
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  coverSub: {
    fontSize: 12,
    color: "#a8a29e",
    textAlign: "center",
    marginBottom: 4,
  },
  coverCount: {
    fontSize: 10,
    color: "#78716c",
    textAlign: "center",
    marginTop: 32,
  },
  // — Índice —
  indexEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f4",
    paddingBottom: 8,
  },
  indexTitle: {
    fontSize: 11,
    color: "#1c1917",
  },
  indexMeta: {
    fontSize: 10,
    color: "#a8a29e",
  },
  sectionTitle: {
    fontSize: 9,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    color: "#1c1917",
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 9,
    color: "#a8a29e",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    fontSize: 9,
    paddingHorizontal: 8,
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
    marginBottom: 16,
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    paddingBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  ingredient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 5,
  },
  dot: {
    width: 4,
    height: 4,
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
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: "#f5f5f4",
    color: "#78716c",
  },
  steps: {
    fontSize: 11,
    color: "#44403c",
    lineHeight: 1.7,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#d6d3d1",
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

export function BookPDF({ recipes, userName }: Props) {
  return (
    <Document>
      {/* Portada */}
      <Page size="A4" style={s.coverPage}>
        <Text style={s.coverTitle}>Mi Recetario</Text>
        <Text style={s.coverSub}>{userName}</Text>
        <Text style={s.coverCount}>
          {recipes.length} receta{recipes.length !== 1 ? "s" : ""}
        </Text>
      </Page>

      {/* Índice */}
      <Page size="A4" style={s.page}>
        <Text style={{ ...s.sectionTitle, marginBottom: 20 }}>Índice</Text>
        {recipes.map((r, i) => (
          <View key={r.id} style={s.indexEntry}>
            <Text style={s.indexTitle}>
              {i + 1}. {r.title}
            </Text>
            <Text style={s.indexMeta}>
              {r.category}
              {r.time ? ` · ${r.time}` : ""}
            </Text>
          </View>
        ))}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>mis recetas</Text>
        </View>
      </Page>

      {/* Una página por receta */}
      {recipes.map((recipe, index) => {
        const ingredients = recipe.ingredients as Ingredient[];
        const metaParts = [recipe.category, recipe.method, recipe.time].filter(
          Boolean,
        );

        return (
          <Page key={recipe.id} size="A4" style={s.page}>
            <View style={s.header}>
              <View style={s.meta}>
                {metaParts.map((p, i) => (
                  <Text key={i} style={s.metaText}>
                    {p}
                  </Text>
                ))}
              </View>
              <Text style={s.pageTitle}>{recipe.title}</Text>
              {recipe.tags?.length > 0 && (
                <View style={s.tags}>
                  {recipe.tags.map((tag) => (
                    <Text key={tag.id} style={s.tag}>
                      {tag.name}
                    </Text>
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
                    <Text key={i} style={s.condimentPill}>
                      {c}
                    </Text>
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
              <Text style={s.footerText}>mis recetas</Text>
              <Text style={s.footerText}>
                {index + 1} / {recipes.length}
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
