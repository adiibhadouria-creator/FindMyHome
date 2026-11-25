import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { storageService } from '../services/storage';
import { soundService } from '../services/soundService';

export default function HomeScreen({ onStartNew, onResumeGame, onOpenMemes, onOpenRules }) {
  const [activeGame, setActiveGame] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const game = await storageService.getActiveGame();
    const past = await storageService.getGameHistory();
    setActiveGame(game);
    setHistory(past);
  };

  const handlePress = (callback) => {
    soundService.playSound('tap');
    soundService.triggerHaptic('light');
    callback();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" />

      {/* Decorative Card Suits Header */}
      <View style={styles.suitBanner}>
        <Text style={[styles.suitIcon, { color: '#ef4444' }]}>♥</Text>
        <Text style={[styles.suitIcon, { color: '#38bdf8' }]}>♠</Text>
        <Text style={[styles.suitIcon, { color: '#f59e0b' }]}>♦</Text>
        <Text style={[styles.suitIcon, { color: '#10b981' }]}>♣</Text>
      </View>

      <Text style={styles.appTitle}>JUDGEMENT</Text>
      <Text style={styles.appSubtitle}>Kachuful Scorekeeper & Meme Roasts</Text>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Resume Active Game Card */}
        {activeGame && (
          <TouchableOpacity
            style={styles.resumeCard}
            onPress={() => handlePress(onResumeGame)}
            activeOpacity={0.85}
          >
            <View style={styles.resumeHeader}>
              <View style={styles.liveDot} />
              <Text style={styles.resumeTitle}>GAME IN PROGRESS</Text>
            </View>
            <Text style={styles.resumeDetails}>
              Round {activeGame.currentRoundIndex + 1} of {activeGame.rounds.length} • {activeGame.players.length} Players
            </Text>
            <View style={styles.resumeAction}>
              <Text style={styles.resumeBtnText}>Resume Game ▶</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Start New Game Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => handlePress(onStartNew)}
          activeOpacity={0.85}
        >
          <View style={styles.btnIconCircle}>
            <Text style={styles.btnEmoji}>🃏</Text>
          </View>
          <View style={styles.btnTextCol}>
            <Text style={styles.primaryBtnTitle}>Start New Game</Text>
            <Text style={styles.primaryBtnSubtitle}>Set up players, rounds & trump rules</Text>
          </View>
        </TouchableOpacity>

        {/* Meme Studio Button */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => handlePress(onOpenMemes)}
          activeOpacity={0.85}
        >
          <View style={[styles.btnIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Text style={styles.btnEmoji}>🎭</Text>
          </View>
          <View style={styles.btnTextCol}>
            <Text style={styles.secondaryBtnTitle}>Meme Studio & Roasts</Text>
            <Text style={styles.secondaryBtnSubtitle}>Upload friend photos & test roast soundboard</Text>
          </View>
        </TouchableOpacity>

        {/* Rules & Scoring */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => handlePress(onOpenRules)}
          activeOpacity={0.85}
        >
          <View style={[styles.btnIconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.2)' }]}>
            <Text style={styles.btnEmoji}>📖</Text>
          </View>
          <View style={styles.btnTextCol}>
            <Text style={styles.secondaryBtnTitle}>Judgement Rules</Text>
            <Text style={styles.secondaryBtnSubtitle}>Dealer restriction, scoring & trump order</Text>
          </View>
        </TouchableOpacity>

        {/* Recent Game Quick Summary */}
        {history.length > 0 && (
          <View style={styles.historyBox}>
            <Text style={styles.historyHeading}>🏆 LAST GAME WINNER</Text>
            <View style={styles.historyCard}>
              <Text style={styles.winnerName}>🥇 {history[0].winner?.name || 'Player'}</Text>
              <Text style={styles.winnerPoints}>{history[0].winner?.totalPoints || 0} pts</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready for physical card table banter</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090d16',
    paddingTop: 54,
    paddingHorizontal: 20,
  },
  suitBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  suitIcon: {
    fontSize: 22,
    fontWeight: '900',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f8fafc',
    textAlign: 'center',
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  resumeCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#38bdf8',
  },
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38bdf8',
    marginRight: 8,
  },
  resumeTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  resumeDetails: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  resumeAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  resumeBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  btnEmoji: {
    fontSize: 24,
  },
  btnTextCol: {
    flex: 1,
  },
  primaryBtnTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  primaryBtnSubtitle: {
    fontSize: 12,
    color: '#451a03',
    marginTop: 2,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryBtnTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
  },
  secondaryBtnSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  historyBox: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  historyHeading: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winnerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  winnerPoints: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
});
