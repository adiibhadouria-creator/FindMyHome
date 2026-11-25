import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { soundService } from '../services/soundService';

export default function NumberStepper({
  value = 0,
  min = 0,
  max = 13,
  onChange,
  disabledNumbers = [], // e.g. dealer restricted bid
  disabledMessage = '',
  accentColor = '#f59e0b',
}) {
  const handleSelect = (num) => {
    if (disabledNumbers.includes(num)) {
      soundService.playSound('clown_horn');
      soundService.triggerHaptic('error');
      return;
    }
    soundService.playSound('tap');
    soundService.triggerHaptic('light');
    onChange(num);
  };

  const handleDecrement = () => {
    let next = value - 1;
    while (next >= min && disabledNumbers.includes(next)) {
      next--;
    }
    if (next >= min) {
      handleSelect(next);
    }
  };

  const handleIncrement = () => {
    let next = value + 1;
    while (next <= max && disabledNumbers.includes(next)) {
      next++;
    }
    if (next <= max) {
      handleSelect(next);
    }
  };

  const chips = [];
  for (let i = min; i <= max; i++) {
    chips.push(i);
  }

  return (
    <View style={styles.container}>
      {/* Minus / Value / Plus Quick Stepper */}
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={[styles.stepBtn, value <= min && styles.stepBtnDisabled]}
          onPress={handleDecrement}
          disabled={value <= min}
          activeOpacity={0.7}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>

        <View style={[styles.valueBox, { borderColor: accentColor }]}>
          <Text style={[styles.valueText, { color: accentColor }]}>{value}</Text>
        </View>

        <TouchableOpacity
          style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
          onPress={handleIncrement}
          disabled={value >= max}
          activeOpacity={0.7}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Select Horizontal Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {chips.map((num) => {
          const isSelected = value === num;
          const isDisabled = disabledNumbers.includes(num);

          return (
            <TouchableOpacity
              key={num}
              style={[
                styles.chip,
                isSelected && [styles.chipSelected, { backgroundColor: accentColor, borderColor: accentColor }],
                isDisabled && styles.chipDisabled,
              ]}
              onPress={() => handleSelect(num)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected,
                  isDisabled && styles.chipTextDisabled,
                ]}
              >
                {num}
              </Text>
              {isDisabled && <Text style={styles.illegalSubtext}>BANNED</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {disabledNumbers.includes(value) && (
        <Text style={styles.warningText}>
          ⚠️ {disabledMessage || `Bid of ${value} is illegal for dealer!`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  stepBtnDisabled: {
    backgroundColor: '#1e293b',
    opacity: 0.4,
  },
  stepBtnText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  valueBox: {
    minWidth: 64,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
  },
  valueText: {
    fontSize: 26,
    fontWeight: '900',
  },
  chipScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    gap: 6,
  },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1e293b',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    transform: [{ scale: 1.08 }],
  },
  chipDisabled: {
    backgroundColor: '#450a0a',
    borderColor: '#ef4444',
    borderStyle: 'dashed',
  },
  chipText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: '#0f172a',
    fontWeight: '900',
  },
  chipTextDisabled: {
    color: '#f87171',
    textDecorationLine: 'line-through',
  },
  illegalSubtext: {
    position: 'absolute',
    bottom: -10,
    fontSize: 7,
    fontWeight: '900',
    color: '#ef4444',
  },
  warningText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
});
