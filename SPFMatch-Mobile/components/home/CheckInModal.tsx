import React, { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { X } from 'lucide-react-native'
import { QuestionCard } from '../journal/QuestionCard'
import {
  CHECK_IN_LEVEL_LABELS,
  CHECK_IN_QUESTIONS,
  METRIC_LABELS,
  getLevelLabel,
  getLevelValue,
} from '../../constants/checkIn'
import { getCheckInHistory, getTodayCheckIn, saveDailyCheckIn } from '../../utils/checkInStorage'
import type { CheckInMetricId, DailyCheckInDraft, DailyCheckInEntry } from '../../types'

function entryToDraft(entry: DailyCheckInEntry): DailyCheckInDraft {
  return {
    irritation: getLevelLabel(entry.irritation),
    dryness: getLevelLabel(entry.dryness),
    oiliness: getLevelLabel(entry.oiliness),
    breakouts: getLevelLabel(entry.breakouts),
  }
}

function formatUpdatedTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

interface CheckInModalProps {
  visible: boolean
  onClose: () => void
  onSaved: () => void
}

export function CheckInModal({ visible, onClose, onSaved }: CheckInModalProps) {
  const insets = useSafeAreaInsets()

  const [answers, setAnswers] = useState<DailyCheckInDraft>({})
  const [todayEntry, setTodayEntry] = useState<DailyCheckInEntry | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Load today's entry whenever modal opens
  useEffect(() => {
    if (!visible) return

    async function hydrate() {
      const history = await getCheckInHistory()
      const entry = getTodayCheckIn(history)
      setTodayEntry(entry)
      setAnswers(entry ? entryToDraft(entry) : {})
      setIsEditing(false)
      setIsHydrated(true)
    }

    hydrate()
  }, [visible])

  const answeredCount = useMemo(
    () => CHECK_IN_QUESTIONS.filter((q) => answers[q.id]).length,
    [answers],
  )
  const totalQuestions = CHECK_IN_QUESTIONS.length
  const showForm = todayEntry === null || isEditing

  const handleSelect = (metricId: CheckInMetricId, option: string) => {
    setAnswers((prev) => ({ ...prev, [metricId]: option }))
  }

  const handleSave = async () => {
    if (answeredCount < totalQuestions) return
    setIsSaving(true)
    try {
      const history = await saveDailyCheckIn({
        irritation: getLevelValue(answers.irritation ?? 'None'),
        dryness: getLevelValue(answers.dryness ?? 'None'),
        oiliness: getLevelValue(answers.oiliness ?? 'None'),
        breakouts: getLevelValue(answers.breakouts ?? 'None'),
      })
      const updated = getTodayCheckIn(history)
      setTodayEntry(updated)
      setAnswers(updated ? entryToDraft(updated) : {})
      setIsEditing(false)
      onSaved()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>Daily Check-In</Text>
            <Text style={styles.title}>
              {!isHydrated
                ? 'Loading...'
                : showForm
                  ? 'How did your skin feel today?'
                  : "You're checked in for today"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={20} color="rgba(255,255,255,0.85)" />
          </TouchableOpacity>
        </View>

        {!isHydrated ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading today's check-in…</Text>
          </View>
        ) : showForm ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Progress */}
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

            {CHECK_IN_QUESTIONS.map((question) => (
              <QuestionCard
                key={question.id}
                title={question.title}
                description={question.helper}
                options={CHECK_IN_LEVEL_LABELS as unknown as string[]}
                selectedOption={answers[question.id] ?? null}
                onSelectOption={(option) => handleSelect(question.id, option)}
              />
            ))}

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.primaryBtn,
                answeredCount < totalQuestions && styles.primaryBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={answeredCount < totalQuestions || isSaving}
            >
              <Text style={styles.primaryBtnText}>
                {isSaving
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Check-In'
                    : 'Save Check-In'}
              </Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.secondaryBtn}
                onPress={() => {
                  setAnswers(todayEntry ? entryToDraft(todayEntry) : {})
                  setIsEditing(false)
                }}
              >
                <Text style={styles.secondaryBtnText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : todayEntry ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.summaryCard}>
              <Text style={styles.summaryHeading}>Today's responses</Text>
              <Text style={styles.summaryTimestamp}>
                Saved at {formatUpdatedTime(todayEntry.updatedAt)}
              </Text>

              <View style={styles.summaryGrid}>
                {(Object.keys(METRIC_LABELS) as CheckInMetricId[]).map((id) => (
                  <View key={id} style={styles.summaryTile}>
                    <Text style={styles.summaryLabel}>{METRIC_LABELS[id]}</Text>
                    <Text style={styles.summaryValue}>{getLevelLabel(todayEntry[id])}</Text>
                    <Text style={styles.summaryScore}>Score {todayEntry[id]} / 4</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.primaryBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.primaryBtnText}>Update Today's Answers</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : null}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: '#B3352B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.72)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
    gap: 12,
  },
  progressBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  summaryHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryTimestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 6,
  },
  summaryTile: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    gap: 3,
  },
  summaryLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryValue: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  summaryScore: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
  },
  primaryBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
})
