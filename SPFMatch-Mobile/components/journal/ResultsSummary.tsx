import React, { useMemo } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FITZPATRICK_INFO, SKIN_TYPE_INFO } from '../../constants/quiz'
import { normalizePreferences, filterByPreferences } from '../../utils/fitzpatrick'
import type { FitzpatrickType, SkinType, SunscreenProduct, QuizAnswers } from '../../types/index'
import { SunscreenCard } from './SunscreenCard'

// Load bundled database
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sunscreenDatabase: Record<string, SunscreenProduct[]> = require('../../assets/data/sunscreen-database.json')

interface ResultsSummaryProps {
  fitzpatrickType: FitzpatrickType
  skinType: SkinType
  answers: QuizAnswers
  onRetake: () => void
  bottomInset: number
}

export function ResultsSummary({
  fitzpatrickType,
  skinType,
  answers,
  onRetake,
  bottomInset,
}: ResultsSummaryProps) {
  const fitzpatrickData = FITZPATRICK_INFO[fitzpatrickType]
  const skinTypeDescription = SKIN_TYPE_INFO[skinType]

  const { recommendations, baseCount } = useMemo(() => {
    const key = `${fitzpatrickType}-${skinType}`
    const base = sunscreenDatabase[key] || []

    const prefs = {
      filterType: normalizePreferences(answers.filterType || [], 'filterType'),
      tint: normalizePreferences(answers.tint || [], 'tint'),
      vehicle: normalizePreferences(answers.vehicle || [], 'vehicle'),
    }

    return {
      recommendations: filterByPreferences(base, prefs),
      baseCount: base.length,
    }
  }, [fitzpatrickType, skinType, answers])

  const noPreferenceMatch = baseCount > 0 && recommendations.length === 0

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* ── Skin profile cards ── */}
      <Text style={styles.sectionHeader}>Your Skin Profile</Text>

      <View style={styles.profileRow}>
        <View style={[styles.profileCard, { flex: 1 }]}>
          <Text style={styles.profileLabel}>Fitzpatrick</Text>
          <Text style={styles.profileValue}>{fitzpatrickData.name}</Text>
          <Text style={styles.profileDescription}>{fitzpatrickData.description}</Text>
        </View>
      </View>

      <View style={[styles.profileCard, { marginTop: 0 }]}>
        <Text style={styles.profileLabel}>Skin Condition</Text>
        <Text style={styles.profileValue}>
          {skinType.charAt(0).toUpperCase() + skinType.slice(1)}
        </Text>
        <Text style={styles.profileDescription}>{skinTypeDescription}</Text>
      </View>

      <View style={styles.divider} />

      {/* ── Recommendations ── */}
      <View style={styles.recHeader}>
        <Text style={styles.sectionHeader}>Recommended Sunscreens</Text>
        <Text style={styles.recCount}>
          {recommendations.length} match{recommendations.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      {noPreferenceMatch ? (
        <View style={styles.noMatchCard}>
          <Text style={styles.noMatchTitle}>No exact preference match</Text>
          <Text style={styles.noMatchText}>
            We found {baseCount} sunscreen{baseCount !== 1 ? 's' : ''} for your skin type, but none matched your filter/tint/vehicle preferences. Try changing your preferences.
          </Text>
        </View>
      ) : recommendations.length === 0 ? (
        <View style={styles.noMatchCard}>
          <Text style={styles.noMatchTitle}>No recommendations found</Text>
          <Text style={styles.noMatchText}>
            We don't have sunscreen data for your skin profile yet. Try retaking the quiz.
          </Text>
        </View>
      ) : (
        recommendations.map((product, i) => (
          <SunscreenCard key={`${product.name}-${i}`} product={product} index={i} />
        ))
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.retakeButton}
        onPress={onRetake}
      >
        <Text style={styles.retakeButtonText}>Retake Quiz</Text>
      </TouchableOpacity>

      <View style={{ height: Math.max(bottomInset + 80, 100) }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    gap: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  profileRow: {
    flexDirection: 'row',
    gap: 10,
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 4,
  },
  profileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 4,
  },
  recHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recCount: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  noMatchCard: {
    backgroundColor: 'rgba(255,200,100,0.15)',
    borderColor: 'rgba(255,200,100,0.4)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  noMatchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noMatchText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 18,
  },
  retakeButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginTop: 4,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
})
