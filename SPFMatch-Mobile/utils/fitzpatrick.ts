import { QUIZ_QUESTIONS, FITZPATRICK_THRESHOLDS } from '../constants/quiz'
import type { QuizAnswers, FitzpatrickType, SkinType } from '../types/index'

/**
 * Calculate Fitzpatrick skin type based on quiz answers
 * @param answers User's quiz responses
 * @returns Fitzpatrick type (1-6)
 */
export function calculateFitzpatrickType(
  answers: QuizAnswers
): FitzpatrickType {
  let totalScore = 0

  // Calculate score from first 10 questions (exclude skinType question)
  for (let i = 0; i < QUIZ_QUESTIONS.length - 1; i++) {
    const question = QUIZ_QUESTIONS[i]
    const answer = answers[question.id]

    if (answer && question.scores) {
      const optionIndex = question.options.indexOf(answer as string)
      if (optionIndex !== -1) {
        totalScore += question.scores[optionIndex]
      }
    }
  }

  // Determine Fitzpatrick type based on score thresholds
  if (totalScore <= FITZPATRICK_THRESHOLDS[1]) return 1
  if (totalScore <= FITZPATRICK_THRESHOLDS[2]) return 2
  if (totalScore <= FITZPATRICK_THRESHOLDS[3]) return 3
  if (totalScore <= FITZPATRICK_THRESHOLDS[4]) return 4
  if (totalScore <= FITZPATRICK_THRESHOLDS[5]) return 5
  return 6
}

/**
 * Extract skin type from quiz answers
 * @param answers User's quiz responses
 * @returns Skin type (normal, oily, dry, combination, sensitive)
 */
export function getSkinType(answers: QuizAnswers): SkinType {
  const skinTypeQuestion = QUIZ_QUESTIONS.find(
    (q) => q.id === 'skinType'
  )

  const answer = answers['skinType']

  if (skinTypeQuestion && skinTypeQuestion.types && answer) {
    const optionIndex = skinTypeQuestion.options.indexOf(answer as string)
    if (optionIndex !== -1) {
      return skinTypeQuestion.types[optionIndex] as SkinType
    }
  }

  return 'normal'
}
