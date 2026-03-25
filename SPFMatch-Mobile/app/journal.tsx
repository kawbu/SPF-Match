import { LinearGradient } from 'expo-linear-gradient'
import { Stack, useRouter } from 'expo-router'
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const QUESTIONS = [
  {
    id: 'skin_type',
    title: 'What best describes your skin type?',
    options: ['Dry', 'Combination', 'Oily', 'Sensitive'],
  },
  {
    id: 'sun_exposure',
    title: 'How much sun exposure do you get most days?',
    options: ['Low (mostly indoors)', 'Moderate', 'High (outdoors often)'],
  },
  {
    id: 'finish_preference',
    title: 'What finish do you prefer?',
    options: ['Matte', 'Natural', 'Dewy'],
  },
]

export default function JournalScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()

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

          <Text style={styles.kicker}>Journal</Text>
          <Text style={styles.title}>Sunscreen Match Questionnaire</Text>
          <Text style={styles.subtitle}>
            Starter layout only. Selection logic and matching will be added next.
          </Text>

          {QUESTIONS.map((question) => (
            <View key={question.id} style={styles.card}>
              <Text style={styles.questionTitle}>{question.title}</Text>

              {question.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity activeOpacity={0.8} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get My SPF Match</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingBottom: 28,
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
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  questionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
})
