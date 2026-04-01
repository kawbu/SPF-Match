import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface QuestionCardProps {
  title: string
  options: string[]
  selectedOption: string | null
  onSelectOption: (option: string) => void
}

export function QuestionCard({
  title,
  options,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.questionTitle}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          activeOpacity={0.8}
          accessibilityRole="button"
          style={[
            styles.optionButton,
            selectedOption === option && styles.optionButtonSelected,
          ]}
          onPress={() => onSelectOption(option)}
        >
          <View
            style={[
              styles.optionCheckbox,
              selectedOption === option && styles.optionCheckboxSelected,
            ]}
          />
          <Text
            style={[
              styles.optionText,
              selectedOption === option && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
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
    marginBottom: 8,
  },
  optionButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.6)',
  },
  optionCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  optionCheckboxSelected: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderColor: 'rgba(255,255,255,0.7)',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
})
