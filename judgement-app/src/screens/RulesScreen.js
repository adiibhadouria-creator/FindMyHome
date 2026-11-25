import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function RulesScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Judgement Rules</Text>
        <View style={{ width: 45 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 What is Judgement (Kachuful)?</Text>
          <Text style={styles.cardBody}>
            Judgement (also known as Kachuful in India, Oh Hell, or Prediction) is a classic trick-taking card game. The objective is NOT to win as many tricks as possible, but to predict <Text style={styles.highlight}>EXACTLY</Text> how many tricks (hands) you will win in each round!
          </Text>
        </View>

        {/* Section 2: Dealer Restriction */}
        <View style={[styles.card, styles.dealerCard]}>
          <Text style={styles.dealerTitle}>⚠️ The Sacred Dealer Rule (Judgement Constraint)</Text>
          <Text style={styles.cardBody}>
            The dealer bids last. The sum of all players' bids <Text style={styles.highlightRed}>CANNOT</Text> equal the number of cards dealt in that round.{'\n\n'}
            <Text style={styles.exampleText}>Example:</Text> 7 cards dealt. The other players bid 2, 1, and 3 (Total = 6). The dealer is strictly forbidden from bidding 1 (because 6 + 1 = 7). At least one player is guaranteed to fail!
          </Text>
        </View>

        {/* Section 3: Scoring Formula */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Standard Scoring System</Text>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreBadgeGreen}>EXACT MATCH</Text>
            <Text style={styles.scoreDesc}><Text style={styles.highlightGreen}>10 + Bid</Text> Points (e.g. Bid 3, Won 3 = 13 pts. Bid 0, Won 0 = 10 pts!)</Text>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreBadgeRed}>MISSED BID</Text>
            <Text style={styles.scoreDesc}><Text style={styles.highlightRed}>0</Text> Points (Even if you were off by just 1 hand!)</Text>
          </View>
        </View>

        {/* Section 4: Trump Suit Rotation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👑 Trump Suit Rotation</Text>
          <Text style={styles.cardBody}>
            Trump rotates automatically every round in this traditional order:
          </Text>
          <View style={styles.trumpList}>
            <Text style={styles.trumpItem}>1. ♠ <Text style={styles.boldWhite}>Hukum</Text> (Spades)</Text>
            <Text style={styles.trumpItem}>2. ♦ <Text style={styles.boldWhite}>Chikat / Ittha</Text> (Diamonds)</Text>
            <Text style={styles.trumpItem}>3. ♣ <Text style={styles.boldWhite}>Chidi</Text> (Clubs)</Text>
            <Text style={styles.trumpItem}>4. ♥ <Text style={styles.boldWhite}>Paan / Laal</Text> (Hearts)</Text>
            <Text style={styles.trumpItem}>5. 🚫 <Text style={styles.boldWhite}>No Trump</Text> (Highest card of suit led wins)</Text>
          </View>
        </View>

        {/* Section 5: Meme Roasts */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎭 Meme Roast Triggers</Text>
          <Text style={styles.cardBody}>
            The app monitors table performance and triggers comedic roasts:
          </Text>
          <Text style={styles.roastBullet}>• <Text style={styles.boldWhite}>🤡 Heavy Choker:</Text> Called 3+ hands and won 0 or 1.</Text>
          <Text style={styles.roastBullet}>• <Text style={styles.boldWhite}>🦆 Duck Egg Streak:</Text> 2 or more consecutive rounds with 0 points ("Moye Moye").</Text>
          <Text style={styles.roastBullet}>• <Text style={styles.boldWhite}>🧲 Accidental Greed:</Text> Called 0 or 1, but got overloaded with 3+ tricks.</Text>
          <Text style={styles.roastBullet}>• <Text style={styles.boldWhite}>🗿 Chad Zero:</Text> Called 0 in a big round and escaped with 0!</Text>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dealerCard: {
    borderColor: '#f59e0b',
    backgroundColor: '#182030',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  dealerTitle: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  cardBody: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
  },
  highlight: {
    color: '#fbbf24',
    fontWeight: 'bold',
  },
  highlightRed: {
    color: '#ef4444',
    fontWeight: '900',
  },
  highlightGreen: {
    color: '#10b981',
    fontWeight: '900',
  },
  exampleText: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  scoreRow: {
    marginTop: 10,
  },
  scoreBadgeGreen: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  scoreBadgeRed: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  scoreDesc: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  trumpList: {
    marginTop: 8,
    gap: 4,
  },
  trumpItem: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  roastBullet: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },
});
