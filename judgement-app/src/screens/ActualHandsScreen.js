import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CardSuitBadge from '../components/CardSuitBadge';
import PlayerAvatar from '../components/PlayerAvatar';
import NumberStepper from '../components/NumberStepper';
import { soundService } from '../services/soundService';

export default function ActualHandsScreen({ game, onSubmitResults, onEditBids }) {
  const currentRound = game.rounds[game.currentRoundIndex];
  const { cardsDealt, trumpSuit, dealerId, roundNumber, bids } = currentRound;

  // Local state for hands won (initialized to currentRound.won or matching bid as smart default)
  const [won, setWon] = useState(() => {
    const initial = {};
    game.players.forEach(p => {
      initial[p.id] = currentRound.won[p.id] ?? 0;
    });
    return initial;
  });

  const handleWonChange = (playerId, val) => {
    setWon(prev => ({
      ...prev,
      [playerId]: val,
    }));
  };

  const totalWon = Object.values(won).reduce((a, b) => a + b, 0);
  const remaining = cardsDealt - totalWon;
  const isSumValid = totalWon === cardsDealt;

  const handleSubmit = () => {
    if (!isSumValid) {
      soundService.playSound('clown_horn');
      soundService.triggerHaptic('error');
      Alert.alert(
        'Hands Total Mismatch! ⚠️',
        remaining > 0
          ? `Total hands won is ${totalWon}, but ${cardsDealt} cards were dealt! Please account for the remaining ${remaining} hand(s).`
          : `Total hands won is ${totalWon}, which exceeds the ${cardsDealt} cards dealt by ${Math.abs(remaining)}. Please double check table results.`
      );
      return;
    }

    soundService.playSound('success');
    soundService.triggerHaptic('success');
    onSubmitResults(won);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.roundLabel}>ROUND {roundNumber} • TRICKS PLAYED</Text>
          <Text style={styles.cardsDealtLabel}>{cardsDealt} Cards Dealt</Text>
        </View>
        <CardSuitBadge suit={trumpSuit} size="normal" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Validator Banner */}
        <View style={[styles.validatorBanner, isSumValid ? styles.bannerValid : styles.bannerInvalid]}>
          <View style={styles.validatorRow}>
            <View>
              <Text style={styles.validatorLabel}>TOTAL HANDS WON</Text>
              <Text style={[styles.validatorValue, isSumValid && styles.validatorValueValid]}>
                {totalWon} <Text style={styles.validatorMax}>/ {cardsDealt}</Text>
              </Text>
            </View>

            <View style={styles.validatorStatusBox}>
              {isSumValid ? (
                <Text style={styles.statusValid}>✅ Exactly {cardsDealt} Hands Won!</Text>
              ) : remaining > 0 ? (
                <Text style={styles.statusWarn}>⏳ {remaining} hand(s) left to assign</Text>
              ) : (
                <Text style={styles.statusError}>❌ {Math.abs(remaining)} extra hand(s) entered</Text>
              )}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ENTER HANDS WON BY EACH PLAYER</Text>

        {game.players.map((player, idx) => {
          const isDealer = player.id === dealerId;
          const playerBid = bids[player.id] ?? 0;
          const playerWon = won[player.id] ?? 0;
          const isMatch = playerBid === playerWon;
          const projectedPoints = isMatch ? 10 + playerBid : 0;

          return (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.playerCardHeader}>
                <PlayerAvatar
                  name={player.name}
                  imageUri={player.avatar}
                  isDealer={isDealer}
                  index={idx}
                  size={42}
                />
                <View style={styles.playerMeta}>
                  <Text style={styles.playerName}>
                    {player.name} {isDealer && '👑'}
                  </Text>
                  <Text style={styles.playerBidInfo}>
                    Called: <Text style={styles.boldBid}>{playerBid}</Text> hands
                  </Text>
                </View>

                {/* Match indicator pill */}
                <View style={[styles.matchPill, isMatch ? styles.matchPillGreen : styles.matchPillRed]}>
                  <Text style={[styles.matchPillText, isMatch ? styles.matchGreenText : styles.matchRedText]}>
                    {isMatch ? `🎯 Match (+${projectedPoints})` : '❌ Miss (0 pts)'}
                  </Text>
                </View>
              </View>

              {/* Number Stepper */}
              <NumberStepper
                value={playerWon}
                min={0}
                max={cardsDealt}
                onChange={(val) => handleWonChange(player.id, val)}
                accentColor={isMatch ? '#10b981' : '#f59e0b'}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.editBidsBtn}
          onPress={onEditBids}
          activeOpacity={0.8}
        >
          <Text style={styles.editBidsBtnText}>‹ Edit Bids</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitBtn, !isSumValid && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>Calculate & Roast 🎭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingTop: 48,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  roundLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cardsDealtLabel: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  validatorBanner: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  bannerValid: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  bannerInvalid: {
    backgroundColor: '#1e293b',
    borderColor: '#eab308',
  },
  validatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validatorLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  validatorValue: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
  },
  validatorValueValid: {
    color: '#10b981',
  },
  validatorMax: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
  },
  validatorStatusBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusValid: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '800',
  },
  statusWarn: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '800',
  },
  statusError: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  playerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playerMeta: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  playerBidInfo: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  boldBid: {
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  matchPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  matchPillGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  matchPillRed: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  matchPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  matchGreenText: {
    color: '#10b981',
  },
  matchRedText: {
    color: '#ef4444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090d16',
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  editBidsBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  editBidsBtnText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '800',
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#f59e0b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
});
