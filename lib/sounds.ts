import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sound file imports
const soundFiles = {
  chime: require('../assets/sounds/chime.mp3'),
  complete: require('../assets/sounds/complete.mp3'),
  pop: require('../assets/sounds/pop.mp3'),
  drop: require('../assets/sounds/drop.mp3'),
  click: require('../assets/sounds/click.mp3'),
};

type SoundName = keyof typeof soundFiles;

class SoundManager {
  private sounds: Map<SoundName, Audio.Sound> = new Map();
  private isMuted: boolean = false;
  private isLoaded: boolean = false;

  // Initialize and preload all sounds
  async init(): Promise<void> {
    if (this.isLoaded) return;
    
    try {
      // Set audio mode for mixing with other apps
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load mute preference
      const mutedPref = await AsyncStorage.getItem('sound_muted');
      this.isMuted = mutedPref === 'true';

      // Preload all sounds
      for (const [name, file] of Object.entries(soundFiles)) {
        const { sound } = await Audio.Sound.createAsync(file, { volume: 0.5 });
        this.sounds.set(name as SoundName, sound);
      }

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load sounds:', error);
    }
  }

  // Play a sound by name
  async play(name: SoundName): Promise<void> {
    if (this.isMuted || !this.isLoaded) return;

    try {
      const sound = this.sounds.get(name);
      if (sound) {
        await sound.replayAsync();
      }
    } catch (error) {
      console.error(`Failed to play sound: ${name}`, error);
    }
  }

  // Set mute state
  async setMuted(muted: boolean): Promise<void> {
    this.isMuted = muted;
    await AsyncStorage.setItem('sound_muted', String(muted));
  }

  // Get mute state
  getMuted(): boolean {
    return this.isMuted;
  }

  // Toggle mute
  async toggleMute(): Promise<boolean> {
    await this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Cleanup sounds when app closes
  async cleanup(): Promise<void> {
    for (const sound of this.sounds.values()) {
      await sound.unloadAsync();
    }
    this.sounds.clear();
    this.isLoaded = false;
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Convenience functions
export const playSound = (name: SoundName) => soundManager.play(name);
export const toggleMute = () => soundManager.toggleMute();
export const isMuted = () => soundManager.getMuted();

