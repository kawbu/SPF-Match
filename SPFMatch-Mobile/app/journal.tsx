import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { QuestionCard } from '../components/journal/QuestionCard'
import { CheckboxCard } from '../components/journal/CheckboxCard'
import { ResultsSummary } from '../components/journal/ResultsSummary'
import { BottomNav } from '../components/home/BottomNav'
import { NAV_TABS } from '../components/home/constants'
import { QUIZ_QUESTIONS } from '../constants/quiz'
import { calculateFitzpatrickType, getSkinType } from '../utils/fitzpatrick'
import type { QuizAnswers } from '../types/index'

export default function JournalScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [showResults, setShowResults] = useState(false)

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const handleToggleCheckbox = (questionId: string, option: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || []

      if (option === 'Anything is fine') {
        // Toggle "Anything is fine" exclusively
        return {
          ...prev,
          [questionId]: current.includes('Anything is fine') ? [] : ['Anything is fine'],
        }
      }

      // Remove "Anything is fine" when picking a real option
      const withoutAnything = current.filter((v) => v !== 'Anything is fine')
      return {
        ...prev,
        [questionId]: withoutAnything.includes(option)
          ? withoutAnything.filter((v) => v !== option)
          : [...withoutAnything, option],
      }
    })
  }

  const handleGetMatch = () => {
    // All radio questions (non-multiselect) must be answered
    const radioQuestions = QUIZ_QUESTIONS.filter((q) => !q.isMultiSelect)
    const allRadioAnswered = radioQuestions.every((q) => answers[q.id])
    // Multi-select preference questions require at least one selection
    const multiQuestions = QUIZ_QUESTIONS.filter((q) => q.isMultiSelect)
    const allMultiAnswered = multiQuestions.every((q) => {
      const val = answers[q.id] as string[] | undefined
      return val && val.length > 0
    })
    if (allRadioAnswered && allMultiAnswered) {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setShowResults(false)
  }

  const answeredCount = (() => {
    const radioAnswered = QUIZ_QUESTIONS.filter(
      (q) => !q.isMultiSelect && answers[q.id]
    ).length
    const multiAnswered = QUIZ_QUESTIONS.filter((q) => {
      if (!q.isMultiSelect) return false
      const val = answers[q.id] as string[] | undefined
      return val && val.length > 0
    }).length
    return radioAnswered + multiAnswered
  })()
  const totalQuestions = QUIZ_QUESTIONS.length

  if (showResults) {
    const fitzpatrickType = calculateFitzpatrickType(answers)
    const skinType = getSkinType(answers)

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

        <LinearGradient
          colors={['#8A2A1F', '#CF6A28', '#B3352B']}
          start={{ x: 0.08, y: 0 }}
          end={{ x: 0.95, y: 1 }}
          style={styles.container}
        >
          <ResultsSummary
            fitzpatrickType={fitzpatrickType}
            skinType={skinType}
            answers={answers}
            onRetake={handleRestart}
            bottomInset={insets.bottom}
          />

          <BottomNav
            tabs={NAV_TABS}
            activeTab="journal"
            bottomInset={insets.bottom}
            onSelect={(id) => {
              if (id === 'home') router.replace('/')
            }}
          />
        </LinearGradient>
      </>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={['#8A2A1F', '#CF6A28', '#B3352B']}
        start={{ x: 0.08, y: 0 }}
        end={{ x: 0.95, y: 1 }}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go back to home"
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <Text style={styles.kicker}>Questionnaire</Text>
          <Text style={styles.title}>Find Your SPF Match</Text>
          <Text style={styles.subtitle}>
            Answer all {totalQuestions} questions to get personalized sunscreen recommendations based on your Fitzpatrick skin type, skin condition, and preferences.
          </Text>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(answeredCount / totalQuestions) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {answeredCount} of {totalQuestions} answered
          </Text>

          {QUIZ_QUESTIONS.map((question) =>
            question.isMultiSelect ? (
              <CheckboxCard
                key={question.id}
                title={question.question}
                options={question.options}
                selectedOptions={(answers[question.id] as string[]) || []}
                onToggleOption={(option) => handleToggleCheckbox(question.id, option)}
              />
            ) : (
              <QuestionCard
                key={question.id}
                title={question.question}
                options={question.options}
                selectedOption={(answers[question.id] as string) || null}
                onSelectOption={(option) => handleSelectOption(question.id, option)}
              />
            )
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.primaryButton,
              answeredCount < totalQuestions && styles.primaryButtonDisabled,
            ]}
            onPress={handleGetMatch}
            disabled={answeredCount < totalQuestions}
          >
            <Text
              style={[
                styles.primaryButtonText,
                answeredCount < totalQuestions && styles.primaryButtonTextDisabled,
              ]}
            >
              Get My SPF Match
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>

        <BottomNav
          tabs={NAV_TABS}
          activeTab="journal"
          bottomInset={insets.bottom}
          onSelect={(id) => {
            if (id === 'home') router.replace('/')
          }}
        />
      </LinearGradient>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
    gap: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  kicker: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  primaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButtonTextDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
})
