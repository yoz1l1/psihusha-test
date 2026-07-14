let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  volume = 0.08,
  delay = 0,
): Promise<void> {
  return new Promise((resolve) => {
    const audioCtx = getCtx();
    if (!audioCtx) {
      resolve();
      return;
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const now = audioCtx.currentTime + delay;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    osc.onended = () => resolve();
  });
}

// --- Ambient CRT hiss ---
let hissNodes: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

function startHiss(): void {
  const audioCtx = getCtx();
  if (!audioCtx || hissNodes) return;

  const bufferSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 5000;
  filter.Q.value = 0.5;

  const gain = audioCtx.createGain();
  gain.gain.value = 0;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  source.start();
  gain.gain.linearRampToValueAtTime(0.025, audioCtx.currentTime + 2);

  hissNodes = { source, gain };
}

function stopHiss(): void {
  if (!hissNodes) return;
  const audioCtx = getCtx();
  if (audioCtx) {
    hissNodes.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
  }
  const nodes = hissNodes;
  setTimeout(() => {
    try { nodes.source.stop(); } catch { /* already stopped */ }
  }, 600);
  hissNodes = null;
}

export const sfx = {
  startHiss,
  stopHiss,
  tabSwitch: () => {
    tone(880, 0.05, 'square', 0.04);
    tone(1320, 0.04, 'square', 0.03, 0.03);
  },
  error: () => {
    tone(220, 0.12, 'sawtooth', 0.1);
    tone(180, 0.15, 'sawtooth', 0.08, 0.1);
    tone(140, 0.2, 'sawtooth', 0.06, 0.2);
  },
  success: () => {
    tone(523, 0.06, 'square', 0.06);
    tone(659, 0.06, 'square', 0.06, 0.05);
    tone(784, 0.1, 'square', 0.07, 0.1);
  },
  denied: () => {
    tone(200, 0.08, 'sawtooth', 0.1);
    tone(150, 0.12, 'sawtooth', 0.09, 0.07);
    tone(100, 0.18, 'sawtooth', 0.07, 0.15);
  },
  logout: () => {
    tone(400, 0.06, 'square', 0.05);
    tone(300, 0.08, 'square', 0.04, 0.05);
  },
  boot: () => {
    tone(330, 0.08, 'square', 0.05);
    tone(440, 0.08, 'square', 0.05, 0.06);
    tone(660, 0.12, 'square', 0.06, 0.12);
  },
  glitch: () => {
    tone(120, 0.04, 'sawtooth', 0.03);
    tone(2000, 0.02, 'square', 0.02, 0.02);
  },
};
