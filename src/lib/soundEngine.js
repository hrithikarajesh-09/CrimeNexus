// CrimeNexus Forensic Audio & Speech Synthesis Engine
// Handles Web Audio API sound effects (board pin stamps, conduit draws)
// and Chromium-safe SpeechSynthesis with Windows unpause/resume fixes.

let audioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

// User-gesture audio unlocker (must be called from onClick / onMouseDown)
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

// Sound 1: Forensic Pin Stamp (plays when an entity node drops on the board)
export function playPinStamp() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Transient thud (corkboard / physical evidence pin)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(260, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // High subtle metallic pin click
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1400, now);
    osc2.frequency.exponentialRampToValueAtTime(700, now + 0.06);
    gain2.gain.setValueAtTime(0.04, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + 0.06);
  } catch (e) {
    // AudioContext blocked fallback
  }
}

// Sound 2: Conduit Snap / Draw (plays when a connection line links two entities)
export function playConduitSnap() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch (e) {
    // AudioContext blocked fallback
  }
}

// Sound 3: Stage Phase Transition Chime
export function playStageChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [587.33, 880, 1174.66].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.03, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  } catch (e) {
    // Fallback
  }
}

// Persistent reference to prevent Chrome garbage collector bug
let activeUtterance = null;
let voiceHeartbeatTimer = null;

// Speech Synthesis Manager with Windows Chrome resilience
export function speakNarration(text, { speed = 1, onStart, onEnd, onError } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('SpeechSynthesis not supported'));
    return;
  }

  // Clear previous voice heartbeat
  if (voiceHeartbeatTimer) {
    clearInterval(voiceHeartbeatTimer);
    voiceHeartbeatTimer = null;
  }

  // Always resume synthesis before speaking
  window.speechSynthesis.resume();

  // Cancel any running speech with a tiny delay to prevent Chrome canceling both
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  setTimeout(() => {
    try {
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      activeUtterance = utterance; // Prevent garbage collection
      if (typeof window !== 'undefined') {
        window.__crimeNexusActiveUtterance = utterance;
      }

      utterance.rate = Math.max(0.7, Math.min(1.8, 1.02 * speed));
      utterance.pitch = 0.98;
      utterance.volume = 1;

      // Select clearest English voice available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && (
            v.name.includes('Natural') || 
            v.name.includes('Google') || 
            v.name.includes('David') || 
            v.name.includes('Samantha') || 
            v.name.includes('Jenny')
          )
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        }
      }

      utterance.onstart = () => {
        // Chromium 14-second pause bug workaround
        voiceHeartbeatTimer = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(voiceHeartbeatTimer);
          }
        }, 10000);

        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (voiceHeartbeatTimer) {
          clearInterval(voiceHeartbeatTimer);
          voiceHeartbeatTimer = null;
        }
        activeUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        if (voiceHeartbeatTimer) {
          clearInterval(voiceHeartbeatTimer);
          voiceHeartbeatTimer = null;
        }
        activeUtterance = null;
        console.warn('SpeechSynthesis error:', err);
        if (onError) onError(err);
      };

      window.speechSynthesis.speak(utterance);

      // Force resume in case browser queued it in paused state
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 50);
    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      if (onError) onError(err);
    }
  }, 40);
}

export function stopNarration() {
  if (voiceHeartbeatTimer) {
    clearInterval(voiceHeartbeatTimer);
    voiceHeartbeatTimer = null;
  }
  activeUtterance = null;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}
