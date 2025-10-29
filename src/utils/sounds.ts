// Sound effects using Web Audio API and simple tone generation
// These create pleasant, kid-friendly sounds without external files

let audioContext: AudioContext | null = null;

// Initialize audio context on user interaction
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Play a simple tone
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.log('Audio not available');
  }
};

// Play a sequence of tones
const playSequence = (notes: { freq: number; duration: number; delay: number }[], volume: number = 0.2) => {
  try {
    const ctx = getAudioContext();
    notes.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';

      const startTime = ctx.currentTime + note.delay;
      gainNode.gain.setValueAtTime(volume, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + note.duration);
    });
  } catch (error) {
    console.log('Audio not available');
  }
};

// Haptic feedback (vibration)
const vibrate = (pattern: number | number[]) => {
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log('Vibration not available');
    }
  }
};

// Sound effects library
export const playSound = (soundType: string) => {
  switch (soundType) {
    case 'click':
      playTone(800, 0.1, 'sine', 0.2);
      vibrate(10);
      break;

    case 'success':
      playSequence([
        { freq: 523, duration: 0.1, delay: 0 },
        { freq: 659, duration: 0.1, delay: 0.1 },
        { freq: 784, duration: 0.2, delay: 0.2 }
      ], 0.25);
      vibrate([10, 50, 10]);
      break;

    case 'error':
      playSequence([
        { freq: 400, duration: 0.1, delay: 0 },
        { freq: 350, duration: 0.15, delay: 0.1 }
      ], 0.2);
      vibrate([20, 30, 20]);
      break;

    case 'star':
      playTone(1047, 0.15, 'sine', 0.25);
      vibrate(15);
      break;

    case 'levelUp':
      playSequence([
        { freq: 523, duration: 0.1, delay: 0 },
        { freq: 659, duration: 0.1, delay: 0.1 },
        { freq: 784, duration: 0.1, delay: 0.2 },
        { freq: 1047, duration: 0.3, delay: 0.3 }
      ], 0.3);
      vibrate([20, 50, 20, 50, 100]);
      break;

    case 'correct':
      playSequence([
        { freq: 659, duration: 0.1, delay: 0 },
        { freq: 784, duration: 0.2, delay: 0.1 }
      ], 0.25);
      vibrate([15, 30, 15]);
      break;

    case 'wrong':
      playTone(200, 0.2, 'square', 0.15);
      vibrate([30]);
      break;

    case 'coin':
      playSequence([
        { freq: 988, duration: 0.05, delay: 0 },
        { freq: 1319, duration: 0.1, delay: 0.05 }
      ], 0.25);
      vibrate(10);
      break;

    case 'badge':
      playSequence([
        { freq: 523, duration: 0.08, delay: 0 },
        { freq: 659, duration: 0.08, delay: 0.08 },
        { freq: 784, duration: 0.08, delay: 0.16 },
        { freq: 1047, duration: 0.12, delay: 0.24 },
        { freq: 1319, duration: 0.2, delay: 0.36 }
      ], 0.3);
      vibrate([15, 30, 15, 30, 15, 30, 100]);
      break;

    case 'whoosh':
      playTone(2000, 0.2, 'sawtooth', 0.15);
      vibrate(20);
      break;

    default:
      playTone(440, 0.1, 'sine', 0.2);
  }
};

// Enable sound (call this on first user interaction)
export const enableSound = () => {
  getAudioContext();
};
