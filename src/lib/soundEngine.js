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
let cachedIndianVoice = null;

// Phonetic text pre-processor for Indian names, legal terms, and financial amounts
export function formatTextForIndianNarration(text) {
  if (!text) return '';
  let formatted = String(text);

  // Currency & Indian financial terms
  formatted = formatted.replace(/₹\s*([0-9.,]+)\s*Cr(ore)?/gi, '$1 Crore Rupees');
  formatted = formatted.replace(/₹\s*([0-9.,]+)\s*L(akh)?(s)?/gi, '$1 Lakh Rupees');
  formatted = formatted.replace(/₹\s*([0-9.,]+)/g, '$1 Rupees');
  formatted = formatted.replace(/\bRs\.?\s*([0-9.,]+)/gi, '$1 Rupees');
  formatted = formatted.replace(/5x\s*₹?20L/gi, 'five transfers of twenty lakh rupees each');
  formatted = formatted.replace(/₹?70L/gi, 'seventy lakh rupees');
  formatted = formatted.replace(/₹?45L/gi, 'forty-five lakh rupees');
  formatted = formatted.replace(/₹?20L/gi, 'twenty lakh rupees');

  // Transaction & Evidence Identifiers (spell out for smooth audio)
  formatted = formatted.replace(/TXN_552/gi, 'Transaction five five two');
  formatted = formatted.replace(/TXN-1001/gi, 'Transaction one zero zero one');
  formatted = formatted.replace(/TXN-(\d+)/gi, 'Transaction $1');
  formatted = formatted.replace(/ACC-1001/gi, 'Account one zero zero one');
  formatted = formatted.replace(/ACC-2201/gi, 'Account two two zero one');
  formatted = formatted.replace(/ACC-7701/gi, 'Account seven seven zero one');
  formatted = formatted.replace(/ACC-7705/gi, 'Account seven seven zero five');
  formatted = formatted.replace(/ACC-MULES/gi, 'Secondary Mule Accounts');
  formatted = formatted.replace(/ACC-(\d+)/gi, 'Account $1');
  formatted = formatted.replace(/PER-108/gi, 'Victim Vikramaditya');
  formatted = formatted.replace(/PER-104/gi, 'Mule Suman Roy');
  formatted = formatted.replace(/PER-101/gi, 'Syndicate Boss Rajesh Verma');
  formatted = formatted.replace(/PER-102/gi, 'Developer Kunal Shah');
  formatted = formatted.replace(/PER-103/gi, 'Broker Devrat Sharma');
  formatted = formatted.replace(/PER-105/gi, 'Hawala Operator Tariq Merchant');
  formatted = formatted.replace(/PER-(\d+)/gi, 'Person $1');
  formatted = formatted.replace(/EVD-001/gi, 'Evidence Exhibit zero zero one');
  formatted = formatted.replace(/EVD-002/gi, 'Evidence Exhibit zero zero two');
  formatted = formatted.replace(/EVD-003/gi, 'Evidence Exhibit zero zero three');
  formatted = formatted.replace(/EVD-(\d+)/gi, 'Evidence Exhibit $1');
  formatted = formatted.replace(/FIR\s*0018\/2026/gi, 'F.I.R. zero zero one eight of 2026');
  formatted = formatted.replace(/\bFIR\b/g, 'F.I.R.');

  // Banking & Legal Acronyms
  formatted = formatted.replace(/\bRTGS\b/g, 'R.T.G.S.');
  formatted = formatted.replace(/\bIMPS\b/g, 'I.M.P.S.');
  formatted = formatted.replace(/\bSWIFT\b/g, 'Swift');
  formatted = formatted.replace(/\bCDR\b/g, 'Call Detail Records');
  formatted = formatted.replace(/\bBNS\b/g, 'B.N.S.');
  formatted = formatted.replace(/\bBSA\b/g, 'B.S.A.');
  formatted = formatted.replace(/\bPMLA\b/g, 'P.M.L.A.');
  formatted = formatted.replace(/\b2FA\b/g, 'two-factor authentication');
  formatted = formatted.replace(/\bOTP\b/g, 'O.T.P.');
  formatted = formatted.replace(/\bCFO\b/g, 'C.F.O.');
  formatted = formatted.replace(/\bCEO\b/g, 'C.E.O.');
  formatted = formatted.replace(/\bAML\b/g, 'anti-money laundering');
  formatted = formatted.replace(/\bDLF\b/g, 'D.L.F.');
  formatted = formatted.replace(/\bSTR-88912\b/g, 'Suspicious Transaction Report 8 8 9 1 2');
  formatted = formatted.replace(/\bT-4401\b/g, 'Tower four four zero one');

  return formatted;
}

// Select Indian English voice (en-IN) to ensure authentic pronunciation of Indian names
export function getIndianEnglishVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Primary: Explicit Indian English voices (en-IN, en_IN, hi-IN)
  const indianVoice = voices.find(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return lang === 'en-in' || 
           name.includes('india') || 
           name.includes('indian') || 
           name.includes('heera') || 
           name.includes('ravi') || 
           name.includes('neerja') || 
           name.includes('prabhat') || 
           name.includes('veena') || 
           name.includes('kavya') ||
           name.includes('kalpana') ||
           name.includes('hemant');
  });

  if (indianVoice) {
    cachedIndianVoice = indianVoice;
    return indianVoice;
  }

  // 2. Secondary: Commonwealth / British English (en-GB) which pronounces Indian subcontinent syllables and names far better than US English
  const britishVoice = voices.find(v => {
    const lang = (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v.name || '').toLowerCase();
    return (lang.startsWith('en-gb') || lang.startsWith('en-au') || name.includes('united kingdom') || name.includes('british')) &&
           (name.includes('natural') || name.includes('google') || name.includes('george') || name.includes('hazel') || name.includes('susan'));
  }) || voices.find(v => (v.lang || '').toLowerCase().startsWith('en-gb'));

  if (britishVoice) {
    cachedIndianVoice = britishVoice;
    return britishVoice;
  }

  // 3. Fallback: Any English voice with natural quality
  const generalVoice = voices.find(v => (v.lang || '').toLowerCase().startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google')))
    || voices.find(v => (v.lang || '').toLowerCase().startsWith('en'))
    || voices[0];

  cachedIndianVoice = generalVoice;
  return generalVoice;
}

export function getActiveVoiceDescription() {
  const v = cachedIndianVoice || getIndianEnglishVoice();
  if (!v) return 'Default Voice';
  if ((v.lang || '').toLowerCase().includes('in') || (v.name || '').toLowerCase().includes('india')) {
    return `Indian English (${v.name.replace(/(Microsoft|Google)\s*/i, '').trim()})`;
  }
  return v.name.replace(/(Microsoft|Google)\s*/i, '').trim();
}

let isVoicePaused = false;
let lastSpokenText = '';
let lastSpokenOptions = null;

// Speech Synthesis Manager with Chromium safety & full sentence completion guarantee
export function speakNarration(text, { speed = 1, onStart, onEnd, onError } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('SpeechSynthesis not supported'));
    return;
  }

  isVoicePaused = false;
  lastSpokenText = text;
  lastSpokenOptions = { speed, onStart, onEnd, onError };

  // Clear previous heartbeat timer
  if (voiceHeartbeatTimer) {
    clearInterval(voiceHeartbeatTimer);
    voiceHeartbeatTimer = null;
  }

  // Ensure synthesizer is ready
  try {
    window.speechSynthesis.resume();
  } catch (e) {}

  // Cancel any previous speech
  try {
    window.speechSynthesis.cancel();
  } catch (e) {}

  // Phonetically format text for Indian names and financial amounts
  const speechText = formatTextForIndianNarration(text);

  setTimeout(() => {
    try {
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(speechText);
      activeUtterance = utterance; // Keep module-level reference to prevent garbage collection
      if (typeof window !== 'undefined') {
        window.__crimeNexusActiveUtterance = utterance;
      }

      // Slightly deliberate rate for clear legal & forensic clarity
      utterance.rate = Math.max(0.75, Math.min(1.6, 0.98 * speed));
      utterance.pitch = 1.0;
      utterance.volume = 1;

      // Select Indian English voice
      const selectedVoice = getIndianEnglishVoice();
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || 'en-IN';
      }

      let hasEnded = false;

      utterance.onstart = () => {
        // Chromium heartbeat fix: call resume() periodically WITHOUT pausing to prevent Chrome thread sleep
        voiceHeartbeatTimer = setInterval(() => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            } else if (!window.speechSynthesis.speaking) {
              clearInterval(voiceHeartbeatTimer);
              voiceHeartbeatTimer = null;
            }
          }
        }, 5000);

        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (hasEnded) return;
        hasEnded = true;
        if (voiceHeartbeatTimer) {
          clearInterval(voiceHeartbeatTimer);
          voiceHeartbeatTimer = null;
        }
        activeUtterance = null;
        isVoicePaused = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        if (hasEnded) return;
        hasEnded = true;
        if (voiceHeartbeatTimer) {
          clearInterval(voiceHeartbeatTimer);
          voiceHeartbeatTimer = null;
        }
        activeUtterance = null;
        isVoicePaused = false;
        // If canceled explicitly, don't trigger error
        if (err && err.error === 'canceled') {
          return;
        }
        console.warn('SpeechSynthesis event:', err);
        if (onError) onError(err);
      };

      window.speechSynthesis.speak(utterance);

      // Extra insurance resume call for Chromium
      setTimeout(() => {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }, 50);

    } catch (err) {
      console.error('Failed to trigger speech synthesis:', err);
      if (onError) onError(err);
    }
  }, 60);
}

export function pauseNarration() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  isVoicePaused = true;
  if (voiceHeartbeatTimer) {
    clearInterval(voiceHeartbeatTimer);
    voiceHeartbeatTimer = null;
  }
  try {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  } catch (e) {}
}

export function resumeNarration() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  isVoicePaused = false;

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      // Restart heartbeat
      voiceHeartbeatTimer = setInterval(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          } else if (!window.speechSynthesis.speaking) {
            clearInterval(voiceHeartbeatTimer);
            voiceHeartbeatTimer = null;
          }
        }
      }, 5000);
      return true;
    }
  } catch (e) {}

  // Fallback: If synthesis was dropped or ended while paused, restart with last spoken text
  if (lastSpokenText && lastSpokenOptions) {
    speakNarration(lastSpokenText, lastSpokenOptions);
    return true;
  }
  return false;
}

export function isNarrationPaused() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return isVoicePaused || window.speechSynthesis.paused;
}

export function stopNarration() {
  isVoicePaused = false;
  lastSpokenText = '';
  lastSpokenOptions = null;
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
