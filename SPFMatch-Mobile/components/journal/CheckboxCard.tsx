import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface CheckboxCardProps {
  title: string
  options: string[]
  selectedOptions: string[]
  onToggleOption: (option: string) => void
}

export function CheckboxCard({
  title,
  options,
  selectedOptions,
  onToggleOption,
}: CheckboxCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.questionTitle}>{title}</Text>
      <Text style={styles.hint}>Select all that apply</Text>
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option)
        return (
          <TouchableOpacity
            key={option}
            activeOpacity={0.8}
            accessibilityRole="checkbox"
            style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
            onPress={() => onToggleOption(option)}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
              {option}
            </Text>
          </TouchableOpacity>
        )
      })}
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
  },
  hint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: -4,
    marginBottom: 2,
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
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(255,255,255,0.8)',
  },
  checkmark: {
    color: '#B3352B',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
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
