// Every sound on the site is synthesized with Web Audio. No sample files, nothing to license.
// Off by default. The context is only created after a user gesture.

type SoundName = "pour" | "tick" | "click" | "achievement" | "beep";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private ambienceGain: GainNode | null = null;
  private ambienceTimer: ReturnType<typeof setInterval> | null = null;
  private chordIndex = 0;

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  unlock() {
    if (typeof window === "undefined" || !this.enabled) return;
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
    } catch {
      this.ctx = null;
    }
  }

  private noiseBuffer(seconds: number) {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  play(name: SoundName) {
    if (!this.enabled) return;
    this.unlock();
    const ctx = this.ctx;
    const out = this.master;
    if (!ctx || !out) return;
    const t = ctx.currentTime;

    if (name === "tick") {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(0.03);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.25, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      src.connect(hp).connect(g).connect(out);
      src.start(t);
      return;
    }

    if (name === "click" || name === "beep" || name === "achievement") {
      const notes =
        name === "click" ? [[660, 0, 0.08]] : name === "beep" ? [[880, 0, 0.09], [1320, 0.1, 0.12]] : [[784, 0, 0.18], [1175, 0.09, 0.3]];
      for (const [f, d, len] of notes) {
        const o = ctx.createOscillator();
        o.type = name === "beep" ? "square" : "sine";
        o.frequency.value = f;
        const g = ctx.createGain();
        const vol = name === "beep" ? 0.05 : 0.12;
        g.gain.setValueAtTime(0, t + d);
        g.gain.linearRampToValueAtTime(vol, t + d + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + d + len);
        o.connect(g).connect(out);
        o.start(t + d);
        o.stop(t + d + len + 0.05);
      }
      return;
    }

    if (name === "pour") {
      // pump hum + gurgling stream
      const dur = 1.5;
      const hum = ctx.createOscillator();
      hum.type = "sawtooth";
      hum.frequency.value = 52;
      const humLp = ctx.createBiquadFilter();
      humLp.type = "lowpass";
      humLp.frequency.value = 180;
      const humG = ctx.createGain();
      humG.gain.setValueAtTime(0, t);
      humG.gain.linearRampToValueAtTime(0.08, t + 0.1);
      humG.gain.linearRampToValueAtTime(0, t + dur);
      hum.connect(humLp).connect(humG).connect(out);
      hum.start(t);
      hum.stop(t + dur + 0.1);

      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(dur);
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 6;
      bp.frequency.value = 700;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 9;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 350;
      lfo.connect(lfoG).connect(bp.frequency);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.25);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      src.connect(bp).connect(g).connect(out);
      src.start(t);
      lfo.start(t);
      lfo.stop(t + dur);
    }
  }

  /** soft lo-fi pad + vinyl crackle */
  setAmbience(on: boolean) {
    if (!on || !this.enabled) {
      if (this.ambienceTimer) clearInterval(this.ambienceTimer);
      this.ambienceTimer = null;
      if (this.ctx && this.ambienceGain) {
        const g = this.ambienceGain;
        g.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
        setTimeout(() => g.disconnect(), 2000);
        this.ambienceGain = null;
      }
      return;
    }
    this.unlock();
    const ctx = this.ctx;
    if (!ctx || !this.master || this.ambienceTimer) return;
    const amb = ctx.createGain();
    amb.gain.value = 0;
    amb.gain.setTargetAtTime(0.5, ctx.currentTime, 1.5);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    amb.connect(lp).connect(this.master);
    this.ambienceGain = amb;

    // Fmaj7, Em7, Dm7, Cmaj7
    const chords = [
      [174.61, 220, 261.63, 329.63],
      [164.81, 196, 246.94, 293.66],
      [146.83, 174.61, 220, 261.63],
      [130.81, 164.81, 196, 246.94],
    ];
    const bar = 3.2;
    const playBar = () => {
      if (!this.ctx || !this.ambienceGain) return;
      const now = this.ctx.currentTime + 0.05;
      const chord = chords[this.chordIndex++ % chords.length];
      chord.forEach((f, i) => {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = f;
        o.detune.value = (Math.random() - 0.5) * 12;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.035 - i * 0.004, now + 0.6);
        g.gain.linearRampToValueAtTime(0.0001, now + bar + 0.4);
        o.connect(g).connect(amb);
        o.start(now);
        o.stop(now + bar + 0.5);
      });
      // crackle
      for (let i = 0; i < 6; i++) {
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuffer(0.01);
        const g = ctx.createGain();
        g.gain.value = 0.03 * Math.random();
        src.connect(g).connect(amb);
        src.start(now + Math.random() * bar);
      }
    };
    playBar();
    this.ambienceTimer = setInterval(playBar, bar * 1000);
  }
}

export const sound = new SoundEngine();
