// ============================================================================
// ATELIER SOUND & MUSIC ENGINE - SILENCED & DISABLED
// All ambient music and sound effects removed per user request.
// ============================================================================

class AtelierAudioEngine {
  public isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('artisan_sound_autoplay', 'false');
        localStorage.setItem('artisan_sound_muted', 'true');
      } catch {
        // ignore
      }
    }
  }

  public getIsPlaying(): boolean {
    return false;
  }

  public getIsMuted(): boolean {
    return true;
  }

  public getVolume(): number {
    return 0;
  }

  public startAmbientSound() {
    // Disabled - No audio
  }

  public stopAmbientSound() {
    // Disabled - No audio
  }

  public toggleMute(): boolean {
    return true;
  }

  public setVolume(_val: number) {
    // Disabled - No audio
  }

  public playClickSFX() {
    // Disabled - No audio
  }

  public playHoverSFX() {
    // Disabled - No audio
  }

  public playBubbleBurst() {
    // Disabled - No audio
  }

  public playBrushStroke(_intensity = 1.0) {
    // Disabled - No audio
  }

  public playChime(_intensity = 1.0) {
    // Disabled - No audio
  }

  public getVisualizerData(): Uint8Array {
    return new Uint8Array(16);
  }
}

export const audioEngine = new AtelierAudioEngine();
