import {
  Document, Page, Text, View, StyleSheet, Font
} from '@react-pdf/renderer'
import type { Ingredient, Tag } from '@/lib/types'

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 60,
    backgroundColor: '#fafaf9',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e5e4',
    paddingBottom: 20,
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 9,
    color: '#a8a29e',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    color: '#1c1917',
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
  },
  notes: {
    fontSize: 10,
    color: '#78716c',
    fontStyle: 'italic',
    marginTop: 8,
    backgroundColor: '#f5f5f4',
    padding: 10,
    borderRadius: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  tag: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    color: '#78716c',
    backgroundColor: '#f5f5f4',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 9,
    color: '#a8a29e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d6d3d1',
  },
  ingredientText: {
    fontSize: 11,
    color: '#44403c',
  },
  condimentPill: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#f5f5f4',
    color: '#78716c',
    marginRight: 6,
    marginBottom: 6,
  },
  condiments: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  steps: {
    fontSize: 11,
    color: '#44403c',
    lineHeight: 1.7,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#d6d3d1',
  },
})

type Props = {
  recipe: any
  ingredients: Ingredient[]
  tags: Tag[]
}

export function RecipePDF({ recipe, ingredients, tags }: Props) {
  const metaParts = [
    recipe.category,
    recipe.method,
    recipe.time,
  ].filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.meta}>
            {metaParts.map((part, i) => (
              <Text key={i} style={styles.metaText}>{part}</Text>
            ))}
          </View>

          <Text style={styles.title}>{recipe.title}</Text>

          {tags.length > 0 && (
            <View style={styles.tags}>
              {tags.map(tag => (
                <Text key={tag.id} style={styles.tag}>{tag.name}</Text>
              ))}
            </View>
          )}

          {recipe.notes && (
            <Text style={styles.notes}>{recipe.notes}</Text>
          )}
        </View>

        {/* Ingredientes */}
        {ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredientes</Text>
            {ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredient}>
                <View style={styles.dot} />
                <Text style={styles.ingredientText}>
                  {[ing.qty, ing.unit, ing.name].filter(Boolean).join(' ')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Condimentos */}
        {recipe.condiments && recipe.condiments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Condimentos / a gusto</Text>
            <View style={styles.condiments}>
              {recipe.condiments.map((c: string, i: number) => (
                <Text key={i} style={styles.condimentPill}>{c}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Preparación */}
        {recipe.steps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparación</Text>
            <Text style={styles.steps}>{recipe.steps}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>mis recetas</Text>
          <Text style={styles.footerText}>{recipe.title}</Text>
        </View>

      </Page>
    </Document>
  )
}