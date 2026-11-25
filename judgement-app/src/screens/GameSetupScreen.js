import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ROUND_PRESETS, CARD_SUITS } from '../constants/cardSuits';
import { soundService } from '../services/soundService';
import PlayerAvatar from '../components/PlayerAvatar';

export default function GameSetupScreen({ onBack, onStartGame }) {
  const [players, setPlayers] = useState([
    { id: 'p1', name: 'Arjun', avatar: null },
    { id: 'p2', name: 'Rohan', avatar: null },
    { id: 'p3', name: 'Pooja', avatar: null },
    { id: 'p4', name: 'Vikram', avatar: null },
  ]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [dealerIndex, setDealerIndex] = useState(0);
  const [selectedPresetId, setSelectedPresetId] = useState('desc_10_1');

  const selectedPreset = ROUND_PRESETS.find(p => p.id === selectedPresetId) || ROUND_PRESETS[0];

  const handleAddPlayer = () => {
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;
    if (players.length >= 8) {
      Alert.alert('Max Players Reached', 'Judgement games typically support up to 8 players.');
      return;
    }
    const newPlayer = {
      id: `p_${Date.now()}`,
      name: trimmed,
      avatar: null,
    };
    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    soundService.playSound('tap');
  };

  const handleRemovePlayer = (id) => {
    if (players.length <= 2) {
      Alert.alert('Minimum Players', 'You need at least 2 players to play Judgement.');
      return;
    }
    const filtered = players.filter(p => p.id !== id);
    setPlayers(filtered);
    if (dealerIndex >= filtered.length) {
      setDealerIndex(0);
    }
    soundService.playSound('tap');
  };

  const handleStart = () => {
    if (players.length < 2) {
      Alert.alert('Not Enough Players', 'Please add at least 2 players.');
      return;
    }

    // Build rounds schedule
    const cardsList = selectedPreset.cards;
    const suitOrder = CARD_SUITS;

    const rounds = cardsList.map((cardsCount, roundIdx) => {
      // Rotate trump suit each round
      const trumpSuit = suitOrder[roundIdx % suitOrder.length];
      // Rotate dealer index each round
      const roundDealerIndex = (dealerIndex + roundIdx) % players.length;
      const dealer = players[roundDealerIndex];

      return {
        roundNumber: roundIdx + 1,
        cardsDealt: cardsCount,
        trumpSuit,
        dealerId: dealer.id,
        dealerName: dealer.name,
        bids: {},
        won: {},
        scores: {},
        isCompleted: false,
      };
    });

    const initialGame = {
      id: `game_${Date.now()}`,
      createdAt: new Date().toISOString(),
      players: players.map(p => ({
        ...p,
        totalPoints: 0,
        matchesWon: 0,
        zeroStreak: 0,
      })),
      rounds,
      currentRoundIndex: 0,
      phase: 'BIDDING', // BIDDING -> ACTUAL_HANDS -> SCOREBOARD -> GAME_OVER
      history: [],
      preset: selectedPreset,
    };

    soundService.playSound('success');
    soundService.triggerHaptic('success');
    onStartGame(initialGame);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Game Setup</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Players Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PLAYERS ({players.length})</Text>
            <Text style={styles.sectionSub}>Tap crown to change starting dealer</Text>
          </View>

          {/* Player list */}
          {players.map((player, idx) => {
            const isDealer = dealerIndex === idx;
            return (
              <View key={player.id} style={styles.playerCard}>
                <TouchableOpacity
                  onPress={() => {
                    setDealerIndex(idx);
                    soundService.playSound('tap');
                  }}
                  activeOpacity={0.7}
                >
                  <PlayerAvatar
                    name={player.name}
                    imageUri={player.avatar}
                    isDealer={isDealer}
                    index={idx}
                    size={46}
                  />
                </TouchableOpacity>

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  <Text style={styles.playerRole}>
                    {isDealer ? '👑 Round 1 Dealer (bids last)' : `Player ${idx + 1}`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemovePlayer(player.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Add Player Input */}
          {players.length < 8 && (
            <View style={styles.addPlayerRow}>
              <TextInput
                style={styles.input}
                placeholder="Enter player name..."
                placeholderTextColor="#64748b"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddPlayer}
                activeOpacity={0.8}
              >
                <Text style={styles.addBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Round Preset Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ROUND STRUCTURE</Text>
          <View style={styles.presetsGrid}>
            {ROUND_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[styles.presetCard, isSelected && styles.presetCardSelected]}
                  onPress={() => {
                    setSelectedPresetId(preset.id);
                    soundService.playSound('tap');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.presetName, isSelected && styles.presetNameSelected]}>
                    {preset.name}
                  </Text>
                  <Text style={styles.presetDesc}>{preset.desc}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Scoring Rules Preview */}
        <View style={styles.rulesSummaryBox}>
          <Text style={styles.rulesSummaryTitle}>📜 STANDARD INDIAN RULES APPLIED</Text>
          <Text style={styles.rulesSummaryText}>
            • Exact Bid Match = <Text style={styles.greenText}>10 + Bid</Text> Points{'\n'}
            • Missed Prediction = <Text style={styles.redText}>0</Text> Points{'\n'}
            • Dealer Restriction = Dealer cannot make sum of bids equal cards dealt!
          </Text>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.startGameBtn}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.startGameBtnText}>Deal & Start Round 1 🃏</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionSub: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '600',
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 14,
  },
  playerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  playerRole: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  removeBtn: {
    padding: 8,
  },
  removeBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addPlayerRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  presetsGrid: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 10,
  },
  presetCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  presetCardSelected: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  presetName: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '800',
  },
  presetNameSelected: {
    color: '#f59e0b',
  },
  presetDesc: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  rulesSummaryBox: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  rulesSummaryTitle: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  rulesSummaryText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
  greenText: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  redText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#090d16',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  startGameBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startGameBtnText: {
    color: '#0f172a',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
