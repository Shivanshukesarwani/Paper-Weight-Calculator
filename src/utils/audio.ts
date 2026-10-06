// Web Audio API procedural sound engine for authentic mechanical calculator & paper roll feel

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const playSound = {
  keyClick: (volume = 0.4, pitchOffset = 0) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Sharp mechanical click
      osc.type = 'triangle';
      const baseFreq = 800 + (pitchOffset * 60) + (Math.random() * 40 - 20);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(volume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio playback fallback
    }
  },

  paperFeed: (volume = 0.3) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      // Thermal printer stepper / paper feed ratchet micro-rattle
      for (let i = 0; i < 3; i++) {
        const stepTime = now + (i * 0.025);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 + Math.random() * 80, stepTime);
        osc.frequency.exponentialRampToValueAtTime(110, stepTime + 0.015);

        gain.gain.setValueAtTime(volume * 0.35, stepTime);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(stepTime);
        osc.stop(stepTime + 0.022);
      }
    } catch {
      // ignore
    }
  },

  paperTear: (volume = 0.5) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || volume <= 0) return;

      const bufferSize = ctx.sampleRate * 0.28;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Noise generator with envelope
      for (let i = 0; i < bufferSize; i++) {
        // High frequency friction noise with crackles
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.4 ? 1 : 0.2);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(4500, ctx.currentTime + 0.25);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  },

  bell: (volume = 0.5) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      // Dual harmonic bell sound for Total / Star *
      const freqs = [1760, 2637, 3520]; // A6, E7, A7
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const decay = 0.5 + idx * 0.15;
        gain.gain.setValueAtTime(volume * (0.4 / (idx + 1)), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // ignore
    }
  },

  clearSwoosh: (volume = 0.3) => {
    try {
      const ctx = getAudioContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      gain.gain.setValueAtTime(volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  }
};
