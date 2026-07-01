let audioCtx = null;
let isPlaying = false;
let osc1, osc2, gainNode;

export function startAmbientAudio() {
  if (isPlaying) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    osc1 = audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // A2

    osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(165, audioCtx.currentTime); // E3 (fifth)

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 3.0);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, audioCtx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    isPlaying = true;
    
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND OFF';
  } catch (e) {
    console.warn('Web Audio pad failed to start:', e);
  }
}

export function toggleAmbientAudio() {
  if (!audioCtx) {
    startAmbientAudio();
    return;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND OFF';
  } else if (audioCtx.state === 'running') {
    audioCtx.suspend();
    const label = document.getElementById('music-status-text');
    if (label) label.textContent = 'SOUND ON';
  }
}

// Automatically bind click events when page loads
document.addEventListener('DOMContentLoaded', () => {
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAmbientAudio();
    });
  }
});
export function initAudioBindings() {
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAmbientAudio();
    });
  }
}
