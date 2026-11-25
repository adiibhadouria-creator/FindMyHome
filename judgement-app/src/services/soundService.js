import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// Sound Synthesizer using Web Audio API (works on Web) or Haptic triggers on Mobile
class SoundService {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = true;
    this.initWebAudio();
  }

  initWebAudio() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }
  }

  ensureAudioContext() {
    if (Platform.OS === 'web' && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  toggleSound(enabled) {
    this.soundEnabled = enabled !== undefined ? enabled : !this.soundEnabled;
    return this.soundEnabled;
  }

  // Haptic feedback
  triggerHaptic(type = 'light') {
    try {
      if (Platform.OS === 'web') return;
      if (type === 'light') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (type === 'medium') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'heavy') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch {
      // Haptics not available on some devices
    }
  }

  // Synthesized comedic sound effects
  playSound(soundType) {
    if (!this.soundEnabled) return;

    if (Platform.OS === 'web') {
      this.ensureAudioContext();
      if (!this.audioContext) return;

      const ctx = this.audioContext;
      const now = ctx.currentTime;

      switch (soundType) {
        case 'moye_moye':
          // Melancholy notes (E4 -> D4 -> C4 -> B3)
          [329.63, 293.66, 261.63, 246.94].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.28);
            gain.gain.setValueAtTime(0.2, now + i * 0.28);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.28 + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.28);
            osc.stop(now + i * 0.28 + 0.35);
          });
          break;

        case 'sad_trombone':
          // Downward slide: D4 -> C#4 -> C4 -> B3 (wah-wah-wah-waaaah)
          [293.66, 277.18, 261.63, 246.94].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            const start = now + idx * 0.3;
            const dur = idx === 3 ? 0.7 : 0.25;
            osc.frequency.setValueAtTime(freq, start);
            if (idx === 3) {
              osc.frequency.linearRampToValueAtTime(freq - 30, start + dur);
            }
            gain.gain.setValueAtTime(0.15, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + dur);
          });
          break;

        case 'clown_horn':
          // Squeak honk-honk
          [587.33, 587.33].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const start = now + i * 0.18;
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(880, start + 0.12);
            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.15);
          });
          break;

        case 'sad_violin':
          // High weep with vibrato
          {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(659.25, now); // E5
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 1.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 1.2);
          }
          break;

        case 'airhorn':
        case 'success':
          // Victorious trumpet fanfare (C5 -> E5 -> G5 -> C6)
          [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            const start = now + i * 0.12;
            const dur = i === 3 ? 0.6 : 0.15;
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(start);
            osc.stop(start + dur);
          });
          break;

        case 'tap':
        default:
          {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
          }
          break;
      }
    } else {
      // On mobile native, trigger rich haptics matching the event
      if (['moye_moye', 'sad_trombone', 'sad_violin'].includes(soundType)) {
        this.triggerHaptic('heavy');
      } else if (['airhorn', 'success'].includes(soundType)) {
        this.triggerHaptic('success');
      } else if (['clown_horn', 'sad_buzzer'].includes(soundType)) {
        this.triggerHaptic('warning');
      } else {
        this.triggerHaptic('light');
      }
    }
  }
}

export const soundService = new SoundService();
