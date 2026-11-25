import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CardSuitBadge({ suit, size = 'normal' }) {
  if (!suit) return null;

  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: suit.bg || '#f1f5f9' }, isSmall && styles.badgeSmall]}>
      <Text style={[styles.symbol, { color: suit.color }, isSmall && styles.symbolSmall]}>
        {suit.symbol}
      </Text>
      <Text style={[styles.label, { color: suit.color }, isSmall && styles.labelSmall]}>
        {suit.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  symbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
  },
  symbolSmall: {
    fontSize: 14,
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 11,
  },
});
