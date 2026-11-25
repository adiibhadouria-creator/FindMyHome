# 🃏 Judgement (Kachuful) Scorekeeper & Meme Roaster

A React Native & Expo mobile companion application for playing the **Judgement** (Kachuful / Oh Hell / Prediction) card game with friends and family.

It manages all player bids, scores, dealer restrictions, and round history, and features an automated **Meme Roast Engine** with comedic sound effects that roasts players whenever they choke on high calls, fall into consistent 0 streaks, or get overloaded with unwanted tricks!

---

## 🚀 Key Features

### 1. 📊 Complete Judgement Scorekeeper
- **Standard Indian Rules Engine**:
  - Exact match (`Bid == Hands Won`): **10 + Bid** points (e.g. Bid 3, Won 3 = 13 pts. Bid 0, Won 0 = 10 pts).
  - Missed prediction (`Bid != Hands Won`): **0** points.
- **The Sacred Dealer Restriction**:
  - Sum of all bids cannot equal total cards dealt.
  - The app automatically calculates and bans the illegal bid on the dealer's turn with clear visual and haptic warnings!
- **Round Presets**:
  - `10 down to 1` (Classic Indian 10-round tournament)
  - `7 down to 1` (Quick game)
  - `13 down to 1` (Full marathon)
  - `1 up to 10` (Warm up to chaos)
  - `1 to 7 to 1` (Mountain / V-shape)
- **Automatic Trump Rotation**:
  - ♠ **Hukum** (Spades)
  - ♦ **Chikat** (Diamonds)
  - ♣ **Chidi** (Clubs)
  - ♥ **Paan** (Hearts)
  - 🚫 **No Trump** (NT)
- **Dealer Button Rotation**:
  - Rotates clockwise every round; the dealer always bids last.

---

### 2. 🎭 Meme Roast Engine & Soundboard
The engine evaluates table performance after each round and pops up full-screen meme cards with sounds and punchlines:

- 🤡 **The Overconfidence Clown (Heavy Choke)**:
  - Triggered when a player bids high (3+ hands) but crawls out with 0 or 1 hand.
  - Sound: Clown horn / Sad buzzer.
  - *Quote*: *"Called 5 hands, won 0! Bhai thoda aaram se, World Cup nahi chal raha!"*
- 🦆 **Duck Egg Streak ("Moye Moye")**:
  - Triggered when a player scores 0 points in 2 or more consecutive rounds!
  - Sound: Melancholy *Moye Moye* synthesizer / Sad violin.
  - *Quote*: *"Moye Moye... Beta tumse na ho payega!"*
- 🧲 **Sabka Theka Tune Liya Hai (Accidental Greed)**:
  - Triggered when a player bids low (0 or 1) and gets overloaded with 3+ tricks.
  - Sound: Whoosh / Wah-wah trombone.
  - *Quote*: *"Arey bhai itna kyu kheecha, baki kya aachar daalenge?"*
- 🗿 **Gigachad Zero Survivor**:
  - Triggered when a player boldly bids 0 in a large round and escapes cleanly with 0 hands for 10 points.
  - Sound: Airhorn fanfare.
  - *Quote*: *"Jalwa hai hamara yahan!"*
- 🪤 **Trapped at Dealer Seat**:
  - Triggered when dealer is forced to bid an awkward number due to the restriction and fails.

---

### 3. 📸 Meme Studio & Custom Roasts
- **Upload Friends' Photos**: Pick funny/embarrassing photos from your camera or photo library.
- **Custom Punchlines**: Write custom quotes to roast specific friends.
- **Category Linking**: Choose whether your custom roast triggers on a Heavy Choke, Zero Streak, Greed, or Chad Zero.
- **Interactive Soundboard**: Tap and test sound effects anytime!

---

### 4. 🏆 Final Accolades & Badges
At the end of the game, players are awarded podium standings plus custom nightly awards:
- 🥇 **Champion of the Table**
- 🤡 **Biggest Choker of the Night** (Largest bid-won deficit)
- 🦆 **Lord of Ducks** (Most 0-point rounds)
- 🎯 **Sniper Accuracy** (Highest exact prediction rate)
- 🗿 **Chad Zero Hero** (Most successful 0-bid escapes)

---

## 📱 Running the App on Your Phone

### Requirements
- Node.js (v18+)
- Mobile device with **Expo Go** app installed:
  - [Expo Go on iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Expo Go on Google Play Store](https://play.google.com/store/apps/details/id/host.exp.exponent)

### Start Development Server
```bash
cd judgement-app
npx expo start
```

1. Open the terminal QR code.
2. **On iPhone**: Open the Camera app and scan the QR code -> Open in Expo Go.
3. **On Android**: Open the Expo Go app -> Scan QR code.
4. **On Web**: Press `w` in the terminal to view in your web browser instantly!

---

## 🗂️ Project Structure

```
judgement-app/
├── App.js                     # Root controller, state machine & navigation
├── app.json                   # Expo configuration & app metadata
├── src/
│   ├── constants/
│   │   ├── cardSuits.js       # Trump suits & round presets
│   │   └── memeTemplates.js   # Preloaded memes, roasts & triggers
│   ├── services/
│   │   ├── memeEngine.js      # Blunder & streak roast evaluator
│   │   ├── soundService.js    # Synthesized audio effects & haptics
│   │   └── storage.js         # AsyncStorage for state, games & custom memes
│   ├── components/
│   │   ├── CardSuitBadge.js   # Crisp trump suit badge
│   │   ├── PlayerAvatar.js    # Player avatar with dealer crown
│   │   ├── NumberStepper.js   # One-hand stepper & quick chips (with banned chip)
│   │   └── MemeModal.js       # Animated roast popup with audio replay
│   └── screens/
│       ├── HomeScreen.js      # Main menu & ongoing game resume
│       ├── GameSetupScreen.js # Player list, starting dealer & rules
│       ├── BiddingScreen.js   # Live bid tracker & dealer restriction
│       ├── ActualHandsScreen.js # Hands won entry & sum validator
│       ├── ScoreboardScreen.js  # Leaderboard & full round-by-round matrix
│       ├── GameOverScreen.js    # Podium, biggest choker & awards
│       ├── MemeStudioScreen.js  # Custom friend photo roast creator & soundboard
│       └── RulesScreen.js       # Detailed rules and guide
```
