import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const AVATAR_COLORS = [
  '#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'
];

export default function PlayerAvatar({ name, imageUri, isDealer, size = 48, index = 0, style }) {
  const initials = (name || '?')
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bgColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <View style={[styles.wrapper, style]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </View>
      )}

      {isDealer && (
        <View style={styles.dealerBadge}>
          <Text style={styles.dealerText}>👑 D</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarImage: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '800',
  },
  dealerBadge: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  dealerText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
