import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { FITZPATRICK_INFO, SKIN_TYPE_INFO } from '../../constants/quiz'
import type { FitzpatrickType, SkinType } from '../../types/index'

interface ResultsSummaryProps {
  fitzpatrickType: FitzpatrickType
  skinType: SkinType
}

export function ResultsSummary({
  fitzpatrickType,
  skinType,
}: ResultsSummaryProps) {
  const fitzpatrickData = FITZPATRICK_INFO[fitzpatrickType]
  const skinTypeDescription = SKIN_TYPE_INFO[skinType]

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Fitzpatrick Type</Text>
        <Text style={styles.typeName}>{fitzpatrickData.name}</Text>
        <Text style={styles.typeDescription}>{fitzpatrickData.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Skin Type</Text>
        <Text style={styles.skinTypeLabel}>{skinType.charAt(0).toUpperCase() + skinType.slice(1)}</Text>
        <Text style={styles.typeDescription}>{skinTypeDescription}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.recommendationLabel}>
        Based on your answers, we'll match you with sunscreens that work best for your skin.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skinTypeLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'capitalize',
  },
  typeDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 8,
  },
  recommendationLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
})
