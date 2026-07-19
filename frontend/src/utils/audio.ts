export const playSound = (base64Audio: string) => {
  if (typeof window === 'undefined') return;
  try {
    const audio = new Audio(base64Audio);
    audio.play().catch((err) => {
      console.warn('Audio playback prevented by browser:', err);
    });
  } catch (err) {
    console.error('Failed to play sound', err);
  }
};

// A short, subtle "blip" sound for when code starts running
const runSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='; 

// A pleasant chime for success
const successSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='; 

// A soft error buzz
const errorSoundBase64 = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';

// Note: The above are currently silent, 44-byte empty WAV files as placeholders.
// You can replace them with actual base64 audio strings of your choice.

export const playRunSound = () => playSound(runSoundBase64);
export const playSuccessSound = () => playSound(successSoundBase64);
export const playErrorSound = () => playSound(errorSoundBase64);
