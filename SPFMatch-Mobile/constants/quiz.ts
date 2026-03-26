export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  scores?: number[]
  types?: string[]
  isMultiSelect?: boolean
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'eyeColor',
    question: 'What color are your eyes?',
    options: [
      'Light blue, gray or green',
      'Blue, gray, or green',
      'Blue',
      'Dark Brown',
      'Brownish Black',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'hairColor',
    question: 'What is the natural color of your hair?',
    options: [
      'Sandy red',
      'Blonde',
      'Chestnut/ Dark Blonde',
      'Dark brown',
      'Black',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'skinColor',
    question:
      'What color is your skin in places where it is not exposed to the sun?',
    options: [
      'Reddish',
      'Very Pale',
      'Pale with a beige tint',
      'Light brown',
      'Dark brown',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'freckles',
    question: 'Do you have freckles on unexposed areas?',
    options: ['Many', 'Several', 'Few', 'Incidental', 'None'],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'sunReaction',
    question: 'What happens when you stay too long in the sun?',
    options: [
      'Painful redness, blistering, peeling',
      'Blistering followed by peeling',
      'Burns sometimes followed by peeling',
      'Rare burns',
      'Never had burns',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'tanningDegree',
    question: 'To what degree do you turn brown?',
    options: [
      'Hardly or not at all',
      'Light color tan',
      'Reasonable tan',
      'Tan very easily',
      'Turn dark brown quickly',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'tanningHours',
    question:
      'Do you turn brown after several hours of sun exposure?',
    options: [
      'Never',
      'Seldom',
      'Sometimes',
      'Often',
      'Always',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'faceReaction',
    question: 'How does your face react to the sun?',
    options: [
      'Very sensitive',
      'Sensitive',
      'Normal',
      'Very resistant',
      'Never had a problem',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'lastExposure',
    question: 'When did you last expose your body to the sun?',
    options: [
      'More than 3 months ago',
      '2-3 months ago',
      '1-2 months ago',
      'Less than a month ago',
      'Less than 2 weeks ago',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'faceExposure',
    question:
      'Do you expose your face, or the area to be treated, to the sun?',
    options: [
      'Never',
      'Hardly ever',
      'Sometimes',
      'Often',
      'Always',
    ],
    scores: [0, 1, 2, 3, 4],
  },
  {
    id: 'skinType',
    question:
      'Which of the following best describes your facial skin?',
    options: [
      'Hydrated and comfortable',
      'Shiny and greasy',
      'Flaky, rough, and tight, sometimes itchy or irritated',
      'Oily in some areas and dry in other areas',
      'Often stings or turns red in response to irritants',
    ],
    types: [
      'normal',
      'oily',
      'dry',
      'combination',
      'sensitive',
    ],
  },
  {
    id: 'filterType',
    question: 'Which sunscreen filter type would you like?',
    options: [
      'Physical/mineral',
      'Chemical',
      'Mixture',
      'Anything is fine',
    ],
    isMultiSelect: true,
  },
  {
    id: 'tint',
    question: 'Which sunscreen tint would you like?',
    options: [
      'Skin-colored',
      'Transparent',
      'No tint',
      'Anything is fine',
    ],
    isMultiSelect: true,
  },
  {
    id: 'vehicle',
    question: 'Which form of sunscreen would you like?',
    options: [
      'Cream/lotion',
      'Spray',
      'Powder',
      'Anything is fine',
    ],
    isMultiSelect: true,
  },
]

export const FITZPATRICK_THRESHOLDS = {
  1: 7,
  2: 16,
  3: 25,
  4: 30,
  5: 34,
  6: Infinity,
} as const

export const FITZPATRICK_INFO: Record<number, { name: string; description: string }> = {
  1: {
    name: 'Type I',
    description:
      'Very fair skin, always burns, never tans. Extremely sensitive to sun exposure.',
  },
  2: {
    name: 'Type II',
    description:
      'Fair skin, usually burns, tans minimally. Very sensitive to sun exposure.',
  },
  3: {
    name: 'Type III',
    description:
      'Medium skin, sometimes burns, tans gradually. Moderately sensitive to sun.',
  },
  4: {
    name: 'Type IV',
    description:
      'Olive skin, rarely burns, tans easily. Less sensitive to sun exposure.',
  },
  5: {
    name: 'Type V',
    description:
      'Brown skin, very rarely burns, tans very easily. Minimally sensitive to sun.',
  },
  6: {
    name: 'Type VI',
    description:
      'Dark brown to black skin, never burns, deeply pigmented. Least sensitive to sun.',
  },
}

export const SKIN_TYPE_INFO: Record<string, string> = {
  normal:
    'Your skin is well-balanced, neither too oily nor too dry. Look for lightweight, non-comedogenic formulas.',
  oily: 'Your skin produces excess sebum. Look for oil-free, mattifying sunscreens that won\'t clog pores.',
  dry: 'Your skin lacks moisture and may feel tight. Look for hydrating sunscreens with moisturizing ingredients.',
  combination:
    'Your skin is oily in some areas and dry in others. Look for balanced formulas that won\'t over-dry or make you greasy.',
  sensitive:
    'Your skin is prone to irritation. Look for mineral-based, fragrance-free sunscreens with gentle ingredients.',
}
