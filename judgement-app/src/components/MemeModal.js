import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { soundService } from '../services/soundService';
import PlayerAvatar from './PlayerAvatar';

const { width } = Dimensions.get('window');

export default function MemeModal({ visible, roasts = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scaleAnim] = useState(new Animated.Value(0.7));
  const [opacityAnim] = useState(new Animated.Value(0));

  const currentRoast = roasts[currentIndex];

  useEffect(() => {
    if (visible && currentRoast) {
      setCurrentIndex(0);
      playRoastEffects(roasts[0]);
    }
  }, [visible, roasts]);

  const playRoastEffects = (roast) => {
    if (!roast) return;
    soundService.playSound(roast.soundType || 'sad_trombone');
    soundService.triggerHaptic('heavy');

    // Bounce animation
    scaleAnim.setValue(0.7);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentIndex < roasts.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      playRoastEffects(roasts[nextIdx]);
    } else {
      onClose();
    }
  };

  const handleReplaySound = () => {
    if (currentRoast) {
      soundService.playSound(currentRoast.soundType);
      soundService.triggerHaptic('medium');
    }
  };

  if (!visible || !currentRoast) return null;

  const isMultiple = roasts.length > 1;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Multi-roast Indicator */}
          {isMultiple && (
            <View style={styles.multiIndicator}>
              <Text style={styles.multiText}>
                Roast {currentIndex + 1} of {roasts.length}
              </Text>
            </View>
          )}

          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: currentRoast.gradient?.[0] || '#ef4444' }]}>
            <Text style={styles.badgeText}>{currentRoast.badge}</Text>
          </View>

          {/* Player info */}
          <View style={styles.playerRow}>
            <PlayerAvatar
              name={currentRoast.playerName}
              imageUri={currentRoast.playerAvatar}
              size={54}
            />
            <View style={styles.playerMeta}>
              <Text style={styles.playerName}>{currentRoast.playerName}</Text>
              <Text style={styles.callStats}>
                Bid: <Text style={styles.boldWhite}>{currentRoast.bid}</Text> | Won:{' '}
                <Text style={styles.boldWhite}>{currentRoast.won}</Text>
              </Text>
            </View>
          </View>

          {/* Meme Visual (Custom image or giant emoji) */}
          <View style={styles.visualContainer}>
            {currentRoast.imageUri ? (
              <Image
                source={{ uri: currentRoast.imageUri }}
                style={styles.memeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.emojiCircle}>
                <Text style={styles.giantEmoji}>{currentRoast.emoji}</Text>
              </View>
            )}
          </View>

          {/* Roast Title */}
          <Text style={styles.title}>{currentRoast.title}</Text>

          {/* Roast Narrative */}
          <Text style={styles.roastText}>{currentRoast.roast}</Text>

          {/* Meme Quote */}
          {currentRoast.quote ? (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>{currentRoast.quote}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.soundBtn}
              onPress={handleReplaySound}
              activeOpacity={0.8}
            >
              <Text style={styles.soundBtnText}>🔊 Replay SFX</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextBtn}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex < roasts.length - 1 ? 'Next Roast 👉' : 'Done Laughing 😂'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: Math.min(width - 32, 380),
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  multiIndicator: {
    position: 'absolute',
    top: 14,
    right: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  multiText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  playerMeta: {
    marginLeft: 14,
    flex: 1,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  callStats: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  boldWhite: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  visualContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  emojiCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0f172a',
    borderWidth: 3,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giantEmoji: {
    fontSize: 54,
  },
  memeImage: {
    width: 220,
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#475569',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  roastText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  quoteBox: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    width: '100%',
    marginBottom: 18,
  },
  quoteText: {
    color: '#fde68a',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    gap: 10,
  },
  soundBtn: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundBtnText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1.4,
    backgroundColor: '#f59e0b',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '900',
  },
});
