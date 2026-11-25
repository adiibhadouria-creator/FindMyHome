import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import PlayerAvatar from '../components/PlayerAvatar';
import { soundService } from '../services/soundService';

export default function GameOverScreen({ game, onPlayAgain, onGoHome }) {
  const rankedPlayers = [...game.players].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
  const winner = rankedPlayers[0];

  useEffect(() => {
    soundService.playSound('success');
    soundService.triggerHaptic('success');
  }, []);

  // Compute accolades across all rounds
  let biggestChoke = { player: null, diff: 0, bid: 0, won: 0, round: 1 };
  let mostDucks = { player: null, count: 0 };
  let sniper = { player: null, accuracy: 0, matches: 0 };
  let chadZero = { player: null, count: 0 };

  const playerStats = {};
  game.players.forEach(p => {
    playerStats[p.id] = { matches: 0, totalRounds: game.rounds.length, ducks: 0, chokes: 0, maxDiff: 0, chads: 0 };
  });

  game.rounds.forEach(rnd => {
    if (!rnd.isCompleted) return;
    game.players.forEach(p => {
      const score = rnd.scores?.[p.id];
      if (!score) return;
      const stats = playerStats[p.id];

      if (score.points > 0) {
        stats.matches++;
      } else {
        stats.ducks++;
      }

      if (score.bid === 0 && score.won === 0) {
        stats.chads++;
      }

      const diff = score.bid - score.won;
      if (diff > stats.maxDiff) {
        stats.maxDiff = diff;
        if (diff > biggestChoke.diff) {
          biggestChoke = { player: p, diff, bid: score.bid, won: score.won, round: rnd.roundNumber };
        }
      }
    });
  });

  // Calculate highest sniper, most ducks, etc.
  game.players.forEach(p => {
    const stats = playerStats[p.id];
    if (stats.ducks > mostDucks.count) {
      mostDucks = { player: p, count: stats.ducks };
    }
    const acc = Math.round((stats.matches / game.rounds.length) * 100);
    if (acc > sniper.accuracy) {
      sniper = { player: p, accuracy: acc, matches: stats.matches };
    }
    if (stats.chads > chadZero.count) {
      chadZero = { player: p, count: stats.chads };
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GAME COMPLETE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Winner Hero Banner */}
        <View style={styles.winnerHero}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.winnerTag}>JUDGEMENT CHAMPION</Text>
          <Text style={styles.winnerName}>{winner?.name}</Text>
          <Text style={styles.winnerPoints}>{winner?.totalPoints || 0} Total Points</Text>

          <PlayerAvatar
            name={winner?.name}
            imageUri={winner?.avatar}
            size={76}
            style={styles.winnerAvatar}
          />
        </View>

        {/* Podium Standings */}
        <Text style={styles.sectionHeading}>FINAL PODIUM</Text>
        <View style={styles.podiumContainer}>
          {rankedPlayers.slice(0, 3).map((p, idx) => (
            <View key={p.id} style={[styles.podiumCol, idx === 0 && styles.firstCol]}>
              <Text style={styles.podiumMedal}>
                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
              </Text>
              <PlayerAvatar name={p.name} imageUri={p.avatar} size={42} index={idx} />
              <Text style={styles.podiumName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.podiumPts}>{p.totalPoints || 0} pts</Text>
            </View>
          ))}
        </View>

        {/* Nightly Badges & Roasts */}
        <Text style={styles.sectionHeading}>SPECIAL ROASTS & BADGES 🎖️</Text>
        <View style={styles.badgesGrid}>
          {/* Biggest Choker */}
          {biggestChoke.player && (
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Text style={styles.badgeEmoji}>🤡</Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Biggest Choker</Text>
                <Text style={styles.badgePlayer}>{biggestChoke.player.name}</Text>
                <Text style={styles.badgeDesc}>
                  Called {biggestChoke.bid}, got {biggestChoke.won} in Round {biggestChoke.round}
                </Text>
              </View>
            </View>
          )}

          {/* Lord of Ducks */}
          {mostDucks.player && mostDucks.count > 0 && (
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.2)' }]}>
                <Text style={styles.badgeEmoji}>🦆</Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Lord of Ducks</Text>
                <Text style={styles.badgePlayer}>{mostDucks.player.name}</Text>
                <Text style={styles.badgeDesc}>
                  Scored {mostDucks.count} zero-point rounds!
                </Text>
              </View>
            </View>
          )}

          {/* Sniper */}
          {sniper.player && (
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Text style={styles.badgeEmoji}>🎯</Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Sniper Accuracy</Text>
                <Text style={styles.badgePlayer}>{sniper.player.name}</Text>
                <Text style={styles.badgeDesc}>
                  {sniper.accuracy}% accuracy ({sniper.matches} exact hits)
                </Text>
              </View>
            </View>
          )}

          {/* Chad Zero Hero */}
          {chadZero.player && chadZero.count > 0 && (
            <View style={styles.badgeCard}>
              <View style={[styles.badgeIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Text style={styles.badgeEmoji}>🗿</Text>
              </View>
              <View style={styles.badgeInfo}>
                <Text style={styles.badgeTitle}>Chad Zero Hero</Text>
                <Text style={styles.badgePlayer}>{chadZero.player.name}</Text>
                <Text style={styles.badgeDesc}>
                  Called 0 & survived {chadZero.count} time(s)!
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={onGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeBtnText}>🏠 Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.againBtn}
          onPress={onPlayAgain}
          activeOpacity={0.85}
        >
          <Text style={styles.againBtnText}>Play Again 🃏</Text>
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
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  winnerHero: {
    backgroundColor: '#1e293b',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  trophy: {
    fontSize: 50,
    marginBottom: 6,
  },
  winnerTag: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  winnerName: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  winnerPoints: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  winnerAvatar: {
    marginTop: 14,
  },
  sectionHeading: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  podiumCol: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  firstCol: {
    borderColor: '#f59e0b',
    backgroundColor: '#1a2234',
    transform: [{ translateY: -6 }],
  },
  podiumMedal: {
    fontSize: 22,
    marginBottom: 4,
  },
  podiumName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 6,
  },
  podiumPts: {
    color: '#fbbf24',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  badgesGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeEmoji: {
    fontSize: 22,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  badgePlayer: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 1,
  },
  badgeDesc: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
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
  homeBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  homeBtnText: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '800',
  },
  againBtn: {
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
  againBtnText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '900',
  },
});
